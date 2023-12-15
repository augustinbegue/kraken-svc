import { Logger } from "tslog";
import { App } from "uWebSockets.js";
import type { WSMessage, WSMessagePlaceUpdate } from "$lib/websocket";
import { prisma } from "$lib/server/db/prisma";

require("dotenv").config({
    path: "../.env",
});

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
        (placeProfile.lastPlaced.getTime() + 10 * 1000 <
            Date.now())) {

        // Update the database
        await prisma.tile.update({
            where: {
                i: data.i,
            },
            data: {
                color: data.color,
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
                color: data.color,
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
                    color: data.color,
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

