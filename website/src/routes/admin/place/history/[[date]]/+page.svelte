<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import { page } from "$app/stores";
    import { goto, invalidateAll } from "$app/navigation";

    export let data: PageData;

    let canvas: HTMLCanvasElement;

    let tresholdDate =
        $page.params.date || new Date().toISOString().slice(0, 16);

    function drawCanvas() {
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const width = PlaceCanvas.CANVAS_SIZE;

        canvas.width = width * PlaceCanvas.TILE_SIZE;
        canvas.height = width * PlaceCanvas.TILE_SIZE;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < data.tiles.length; i++) {
            const tile = data.tiles[i];

            const x = tile.i % width;
            const y = Math.floor(tile.i / width);

            ctx.fillStyle = tile.color;
            ctx.fillRect(
                x * PlaceCanvas.TILE_SIZE,
                y * PlaceCanvas.TILE_SIZE,
                PlaceCanvas.TILE_SIZE,
                PlaceCanvas.TILE_SIZE,
            );
        }
    }

    onMount(() => {
        drawCanvas();
    });

    $: {
        if (data.tiles) {
            drawCanvas();
        }
    }
</script>

<div class="container mx-auto max-w-4xl">
    <h1 class="text-2xl font-semibold">Canvas History</h1>

    <canvas bind:this={canvas} class="border border-gray-400 w-full"></canvas>

    <form
        action="/admin/place/history"
        method="get"
        class="flex flex-row flex-wrap gap-4 items-end"
    >
        <div class="form-control">
            <label for="x" class="label">
                <span class="label-text">Date</span>
            </label>
            <input
                type="datetime-local"
                name="tresholdDate"
                id="date"
                class="input input-bordered"
                bind:value={tresholdDate}
                on:change={() => {
                    goto(`/admin/place/history/${tresholdDate}`);
                }}
            />
        </div>
    </form>
</div>

<style lang="postcss">
</style>
