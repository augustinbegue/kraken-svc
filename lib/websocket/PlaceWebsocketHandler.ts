import { dev } from "$app/environment";
import type { PlaceCanvas } from "$lib/place/PlaceCanvas";
import type { WSMessagePlaceUpdate } from ".";

export class PlaceWebsocketHandler {
    private ws: WebSocket | null = null;
    private readonly wsUrl: string;
    private placeCanvas: PlaceCanvas;

    onReady: () => void = () => {};

    constructor(wsUrl: string, placeCanvas: PlaceCanvas) {
        this.wsUrl = wsUrl;
        this.placeCanvas = placeCanvas;

        this.connect();
    }

    private connect() {
        if (dev) {
            this.ws = new WebSocket(this.wsUrl);
        } else {
            const protocol = location.protocol === "https:" ? "wss" : "ws";
            let tmpWsUrl = new URL(this.wsUrl);
            tmpWsUrl.protocol = protocol;
            this.ws = new WebSocket(tmpWsUrl.toString());
        }

        this.addEventListeners();
    }

    private addEventListeners() {
        if (!this.ws) throw new Error("Websocket is not initialized");

        this.ws.addEventListener("error", (err) => {
            if (dev) console.error("[ws:client] error", err);
        });

        this.ws.addEventListener("open", () => {
            if (dev) console.log("[ws:client] connected");
            this.onReady();
        });

        this.ws.addEventListener("close", () => {
            if (dev) console.log("[ws:client] disconnected");
            this.ws = null;

            console.log("[ws:client] Connection lost. Reconnecting...");
            setTimeout(() => {
                this.connect();
            }, 1000);
        });

        this.ws.addEventListener("message", async (ev) => {
            const message = JSON.parse(await ev.data);
            if (dev) console.log("[ws:client] message", message);

            if (message.type === "place.update") {
                const data = (message as WSMessagePlaceUpdate).data;
                if (dev) console.log("[ws:client] place.update", data);

                this.placeCanvas.updateBoard(data.x, data.y, data.color);
            }
        });
    }

    public destroy() {
        if (this.ws) this.ws.close();
    }
}
