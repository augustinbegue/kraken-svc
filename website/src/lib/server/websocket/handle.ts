import { WebSocket } from "ws";
import type { WSMessage, WSMessagePlaceUpdate } from "../../websocket";
import { updateCanvas } from "../place";
import { GlobalThisWSS, type ExtendedGlobal } from "./utils";
import { getSessionCookie } from "$lib/accounts/utils";
import type { Session } from "@prisma/client";
import { getSession } from "../accounts/utils";

// TODO: Separate the websocket server from sveltekit, use https://github.com/uNetworking/uWebSockets.js instead
// TODO: Only accept requests comming from the sveltekit server
export function handleConnection(
    ws: WebSocket & {
        socketId: string;
    },
    request: any,
) {
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

    console.log(`[wss:kit] client connected (${ws.socketId})`);

    ws.on("message", async (m: string) => {
        console.log(`[wss:kit] client message (${ws.socketId}): ${m}`);

        const sessionId = getSessionCookie(request);
        let session: Session | null;
        if (!sessionId || !(session = await getSession(sessionId))) {
            ws.send(JSON.stringify({ type: "error", message: "no session" }));
            ws.close();
            return;
        }

        let message = JSON.parse(m) as WSMessage;

        if (message.type === "place.update") {
            let data = (message as WSMessagePlaceUpdate).data;

            if (await updateCanvas(session, data.x, data.y, data.color))
                wss.clients.forEach((client: WebSocket) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(m);
                    }
                });
        }
    });

    ws.on("close", () => {
        console.log(`[wss:kit] client disconnected (${ws.socketId})`);
    });
}
