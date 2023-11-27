<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { ArrowBigLeft, Brush, Loader2 } from "lucide-svelte";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import type { WSMessagePlaceUpdate } from "$lib/websocket";

    // Place Canvas
    let canvas: HTMLCanvasElement;
    let cursor: HTMLDivElement;
    let placeCanvas: PlaceCanvas;

    let wsInitialized = false;
    let ws: WebSocket;
    function connectWS() {
        return new Promise<void>((resolve, reject) => {
            if (wsInitialized) resolve();

            const protocol = location.protocol === "https:" ? "wss" : "ws";
            ws = new WebSocket(`${protocol}://${location.host}/websocket`);

            ws.addEventListener("error", (err) => {
                console.error("[ws:client] error", err);
                reject(err);
            });

            ws.addEventListener("open", () => {
                wsInitialized = true;
                resolve();

                console.log("[ws:client] connected");
            });

            ws.addEventListener("close", () => {
                console.log("[ws:client] disconnected");
            });

            ws.addEventListener("message", async (ev) => {
                const message = JSON.parse(await ev.data.text());

                if (message.type === "place.update") {
                    const data = (message as WSMessagePlaceUpdate).data;
                    console.log("[ws:client] place.update", data);

                    placeCanvas.updateBoard(data.x, data.y, data.color);
                }
            });
        });
    }

    let loadingState = "Connecting to websocket...";
    onMount(async () => {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";

        await connectWS();

        if (!wsInitialized) {
            loadingState = "Error: Unable to connect to websocket.";
            return;
        }

        loadingState = "Loading canvas...";

        const res = await fetch(`/api/place/canvas`);

        if (!res.ok) {
            loadingState = "Error: Unable to load canvas.";
            return;
        }

        const board = await res.json();
        placeCanvas = new PlaceCanvas(canvas, cursor, board.tiles, true);
    });

    onDestroy(() => {
        document.getElementsByTagName("html")[0].style.overflow = "auto";
        document.getElementsByTagName("body")[0].style.overflow = "auto";
        if (wsInitialized) ws.close();
    });
</script>

{#if !placeCanvas}
    <div class="flex flex-col justify-center items-center gap-4 h-[90vh]">
        <Loader2 class="animate-spin" size="36" />
        <p>{loadingState}</p>
    </div>
{/if}

<canvas class="canvas" bind:this={canvas} transition:fade> </canvas>

<style lang="postcss">
    .canvas {
        @apply h-screen mx-auto;
        transition: transform 0.1s linear;
        image-rendering: pixelated;
    }

    .buttons {
        @apply flex flex-row gap-4 absolute top-0 w-screen justify-start z-50 p-4;
    }

    .controls {
        @apply flex flex-row gap-4 absolute bottom-0 w-screen justify-center z-50;
    }
    .controls .palette {
        @apply grid grid-rows-2 md:grid-rows-1 grid-flow-col gap-4 p-4 bg-base-200 rounded-t-xl;
    }
    .controls .palette .color {
        @apply w-4 h-4  text-xs md:text-lg md:w-8 md:h-8 rounded-full;
    }

    .cursor {
        @apply absolute top-0 left-0 outline-black outline z-40 rounded-full w-6 h-6;
    }
</style>
