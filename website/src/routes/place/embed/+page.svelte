<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { Loader2 } from "lucide-svelte";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import { PlaceWebsocketHandler } from "$lib/websocket/PlaceWebsocketHandler";
    import type { PageData } from "./$types";

    export let data: PageData;

    // Place Canvas
    let canvas: HTMLCanvasElement;
    let cursor: HTMLDivElement;
    let placeCanvas: PlaceCanvas;

    let wsHandler: PlaceWebsocketHandler;

    let loadingState = "Loading Canvas ...";
    onMount(async () => {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";

        loadingState = "Loading canvas...";

        const res = await fetch(`/api/place/canvas`);

        if (!res.ok) {
            loadingState = "Error: Unable to load canvas.";
            return;
        }

        const board = await res.json();
        placeCanvas = new PlaceCanvas(canvas, cursor, board.tiles, true);

        wsHandler = new PlaceWebsocketHandler(data.wsUrl, placeCanvas);
        wsHandler.onReady = () => {
            loadingState = "";
        };
    });

    onDestroy(() => {
        document.getElementsByTagName("html")[0].style.overflow = "auto";
        document.getElementsByTagName("body")[0].style.overflow = "auto";
        if (wsHandler) wsHandler.destroy();
    });
</script>

{#if loadingState.length !== 0}
    <div class="flex flex-col justify-center items-center gap-4 h-[90vh] z-50">
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
        @apply grid grid-rows-2 md:grid-rows-1 grid-flow-col gap-4 p-4 bg-base-200;
    }
    .controls .palette .color {
        @apply w-4 h-4  text-xs md:text-lg md:w-8 md:h-8 rounded-full;
    }

    .cursor {
        @apply absolute top-0 left-0 outline-black outline z-40 rounded-full w-6 h-6;
    }
</style>
