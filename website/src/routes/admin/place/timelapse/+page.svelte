<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import { Maximize, Play } from "lucide-svelte";

    export let data: PageData;

    let container: HTMLDivElement;
    let canvas: HTMLCanvasElement;

    let currentDate = new Date();

    onMount(async () => {
        currentDate = data.startDate;

        const width = PlaceCanvas.CANVAS_SIZE;

        canvas.width = width * PlaceCanvas.TILE_SIZE;
        canvas.height = width * PlaceCanvas.TILE_SIZE;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    async function drawTimelapse() {
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        for (let i = 0; i < data.tiles.length; i++) {
            const tile = data.tiles[i];

            const x = tile.i % PlaceCanvas.CANVAS_SIZE;
            const y = Math.floor(tile.i / PlaceCanvas.CANVAS_SIZE);

            ctx.fillStyle = tile.color;
            ctx.fillRect(
                x * PlaceCanvas.TILE_SIZE,
                y * PlaceCanvas.TILE_SIZE,
                PlaceCanvas.TILE_SIZE,
                PlaceCanvas.TILE_SIZE,
            );

            currentDate = tile.placedAt;

            await new Promise((resolve) => setTimeout(resolve, 1));
        }
    }
</script>

<div class="flex flex-row gap-4 items-center p-2">
    <button
        class="btn btn-primary"
        on:click={() => {
            container.requestFullscreen();
            drawTimelapse();
        }}
    >
        <Play />
    </button>
</div>

<div
    bind:this={container}
    class="flex flex-col items-center justify-center h-screen"
>
    <canvas bind:this={canvas} class="h-[98vh]"></canvas>
    <p>{currentDate.toLocaleString()}</p>
</div>
