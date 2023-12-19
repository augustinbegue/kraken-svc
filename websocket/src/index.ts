import { Logger } from "tslog";
import { App } from "uWebSockets.js";
import type { WSMessage, WSMessagePlaceUpdate } from "$lib/websocket";
import { prisma } from "$lib/server/db/prisma";
import { intToRGBA, read } from 'jimp';

require("dotenv").config({
    path: "../.env",
});


const endDate = new Date("2023-12-19T20:00:00.000+01:00").getTime();
function getCooldown() {
    const now = Date.now();
    if (now > endDate) {
        return 1 * 1000;
    }

    return 10 * 1000;
}
function getColorFun(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
let image: any;
async function readPixelColor(x: number, y: number): Promise<string> {
    try {
        if (!image) {
            log.info("Reading image");
            image = await read("./end.png");
        }

        const color = intToRGBA(image.getPixelColor(x, y));

        return getColorFun(color.r, color.g, color.b);
    } catch (error) {
        console.error('Error reading pixel color:', error);
    }
}


const APP_SECRET = process.env.APP_SECRET;
const PORT = new URL(process.env.WS_URL || "ws://localhost:8888").port;

const log = new Logger({
    name: "Websocket",
    prettyLogTemplate:
        "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{name}}]\t",
});
const decoder = new TextDecoder("utf-8");

const SUBSCRIPTIONS_ENUM = Object.freeze({
    PLACE: "PLACE",
});
const app = App();

app.ws("/*", {
    open: (ws) => {
        if (!APP_SECRET) {
            throw new Error("APP_SECRET is not defined");
        }

        (ws as any).id = Math.random().toString(36).substring(2, 15);
        log.info(
            `client connected (${(ws as any).id}) from ${decoder.decode(ws.getRemoteAddressAsText()) || "unknown"
            }`,
        );
        ws.subscribe(SUBSCRIPTIONS_ENUM.PLACE);
    },
    close: (ws, code, message) => {
        log.info(`client disconnected (${(ws as any).id})`);
    },
    message: async (ws, message, isBinary) => {
        try {
            log.info(
                `client message (${(ws as any).id}): ${decoder.decode(message)}`,
            );

            const messageObject = JSON.parse(decoder.decode(message)) as WSMessage;

            if (messageObject.secret !== APP_SECRET) {
                ws.send(JSON.stringify({ type: "error", message: "forbidden" }));
                ws.close();
                return;
            }

            // Place update
            if (messageObject.type === "place.update") {
                messageObject.secret = undefined;
                const data = (messageObject as WSMessagePlaceUpdate).data;

                await handlePlaceUpdate(data, ws, isBinary);
            }
        } catch (error) {
            log.error(error);
        }
    },
}).listen(parseInt(PORT), (listenSocket) => {
    if (listenSocket) {
        log.info(`Listening to port ${PORT}`);
    } else {
        log.error(`Failed to listen to port ${PORT}`);
    }
});

async function handlePlaceUpdate(data: WSMessagePlaceUpdate["data"], ws, isBinary: boolean) {
    let placeProfile = await prisma.placeProfile.findUnique({
        where: {
            login: data.login,
        },
    });

    // Check if the cooldown is over
    if (placeProfile &&
        (placeProfile.lastPlaced.getTime() + getCooldown() <
            Date.now())) {

        if (data.x < 0 || data.x > 255 || data.y < 0 || data.y > 255) {
            log.debug(`⚠️ place.update frauduleuse: ${JSON.stringify(data)} (coordinates)`);
            return;
        }

        let color = data.color;

        // If place is over, replace by end image
        const now = Date.now();
        if (now > endDate) {
            color = await readPixelColor(data.x, data.y);
        }

        // Update the database
        await prisma.tile.update({
            where: {
                i: data.i,
            },
            data: {
                color: color,
            },
        });


        log.info(`place.update: ${JSON.stringify(data)}`);

        // Update the database
        await prisma.placeProfile.update({
            where: {
                login: data.login,
            },
            data: {
                tilesPlaced: {
                    increment: 1,
                },
                lastPlaced: new Date(),
            },
        });
        await prisma.tileInfo.create({
            data: {
                color: color,
                i: data.i,
                placedAt: new Date(),
                placeProfile: {
                    connect: {
                        login: data.login,
                    },
                },
            },
        });
        // Send the update to all subscribers
        ws.publish(
            SUBSCRIPTIONS_ENUM.PLACE,
            JSON.stringify({
                type: "place.update",
                data: {
                    color: color,
                    i: data.i,
                    x: data.x,
                    y: data.y,
                    login: data.login,
                }
            }),
            isBinary
        );
    }
    else {
        log.debug(`⚠️ place.update frauduleuse: ${JSON.stringify(data)} (ignored)`);
    }
}

