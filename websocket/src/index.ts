import { Logger } from "tslog";
import { App } from "uWebSockets.js";
import type { WSMessage, WSMessagePlaceUpdate } from "$lib/websocket";

const log = new Logger({
    name: "WS",
    prettyLogTemplate:
        "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{name}}]\t",
});
const decoder = new TextDecoder("utf-8");

const APP_SECRET = process.env.APP_SECRET;
const SUBSCRIPTIONS_ENUM = Object.freeze({
    PLACE: "PLACE",
});
const app = App();

app.ws("/place", {
    open: (ws) => {
        if (!APP_SECRET) {
            throw new Error("APP_SECRET is not defined");
        }

        log.info(
            `[/place] client connected (${decoder.decode(
                ws.getRemoteAddressAsText(),
            )})`,
        );
        ws.subscribe(SUBSCRIPTIONS_ENUM.PLACE);
    },
    close: (ws, code, message) => {
        log.info(
            `[/place] client disconnected (${decoder.decode(
                ws.getRemoteAddressAsText(),
            )})`,
        );
    },
    message: (ws, message, isBinary) => {
        log.info(
            `[/place] client message (${decoder.decode(
                ws.getRemoteAddressAsText(),
            )})`,
        );

        const messageObject = JSON.parse(decoder.decode(message)) as WSMessage;

        if (messageObject.secret !== APP_SECRET) {
            ws.send(JSON.stringify({ type: "error", message: "forbidden" }));
            ws.close();
            return;
        }

        if (messageObject.type === "place.update") {
            const data = (messageObject as WSMessagePlaceUpdate).data;
            ws.publish(SUBSCRIPTIONS_ENUM.PLACE, message, isBinary);
        }
    },
}).listen(parseInt(process.env.WS_PORT || "3001"), (listenSocket) => {
    if (listenSocket) {
        log.info(`Listening to port ${process.env.WS_PORT || "3001"}`);
    }
});
