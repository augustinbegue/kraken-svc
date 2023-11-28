import { env } from "$env/dynamic/private";
import type { WSMessage } from "$lib/websocket";
import { log } from "$lib/server/logger";
import { WebSocket } from "ws";

export class WebsocketHandler {
    private ws: WebSocket;

    constructor() {
        log.info(`Connecting to websocket server: ${env.WS_URL}`);

        this.ws = new WebSocket(env.WS_URL);

        this.ws.on("open", () => {
            log.info("Connected to websocket server");
        });

        this.ws.on("error", (err) => {
            console.error(err);
        });

        this.ws.on("close", () => {
            try {
                this.ws = new WebSocket(env.WS_URL);
            } catch (error) {
                console.error(error);
                log.error("Failed to reconnect to websocket server");
            }
        });

        if (!env.APP_SECRET) {
            throw new Error("APP_SECRET is not defined");
        }
    }

    public send(message: WSMessage) {
        message.secret = env.APP_SECRET;
        this.ws.send(JSON.stringify(message));
    }
}
