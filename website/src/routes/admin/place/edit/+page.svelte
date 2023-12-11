<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";

    export let data: PageData;

    let canvas: HTMLCanvasElement;

    let rectangle = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: "#000000",
    };

    function updateRectangle() {
        const width = PlaceCanvas.CANVAS_SIZE;
        rectangle.x = Math.max(0, Math.min(rectangle.x, width - 1));
        rectangle.y = Math.max(0, Math.min(rectangle.y, width - 1));
        rectangle.width = Math.max(1, Math.min(rectangle.width, width));
        rectangle.height = Math.max(1, Math.min(rectangle.height, width));

        const ctx = canvas?.getContext("2d");

        if (ctx) {
            console.log(
                rectangle.x,
                rectangle.y,
                rectangle.width,
                rectangle.height,
            );

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

            ctx.fillStyle = rectangle.color;
            ctx.fillRect(
                rectangle.x * PlaceCanvas.TILE_SIZE,
                rectangle.y * PlaceCanvas.TILE_SIZE,
                rectangle.width * PlaceCanvas.TILE_SIZE,
                rectangle.height * PlaceCanvas.TILE_SIZE,
            );
        }
    }

    onMount(() => {
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        const width = PlaceCanvas.CANVAS_SIZE;

        canvas.width = width * PlaceCanvas.TILE_SIZE;
        canvas.height = width * PlaceCanvas.TILE_SIZE;
        ctx.imageSmoothingEnabled = false;

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
    });
</script>

<div class="container mx-auto max-w-4xl">
    <h1 class="text-2xl font-semibold">Edit Canvas</h1>

    <canvas bind:this={canvas} class="border border-gray-400 w-full"></canvas>

    <form action="?/update" method="post" class="flex flex-row flex-wrap gap-4">
        <div class="form-control">
            <label for="x" class="label">
                <span class="label-text">X (0-{PlaceCanvas.CANVAS_SIZE})</span>
            </label>
            <input
                type="number"
                name="x"
                id="x"
                class="input input-bordered"
                bind:value={rectangle.x}
                on:change={updateRectangle}
            />
        </div>

        <div class="form-control">
            <label for="y" class="label">
                <span class="label-text">Y (0-{PlaceCanvas.CANVAS_SIZE})</span>
            </label>
            <input
                type="number"
                name="y"
                id="y"
                class="input input-bordered"
                bind:value={rectangle.y}
                on:change={updateRectangle}
            />
        </div>

        <div class="form-control">
            <label for="width" class="label">
                <span class="label-text">
                    Width (1-{PlaceCanvas.CANVAS_SIZE})
                </span>
            </label>
            <input
                type="number"
                name="width"
                id="width"
                class="input input-bordered"
                bind:value={rectangle.width}
                on:change={updateRectangle}
            />
        </div>

        <div class="form-control">
            <label for="height" class="label">
                <span class="label-text">
                    Heigth (1-{PlaceCanvas.CANVAS_SIZE})
                </span>
            </label>
            <input
                type="number"
                name="height"
                id="height"
                class="input input-bordered"
                bind:value={rectangle.height}
                on:change={updateRectangle}
            />
        </div>

        <div class="form-control">
            <label for="color" class="label">
                <span class="label-text">Color</span>
            </label>
            <input
                type="color"
                name="color"
                id="color"
                class=""
                bind:value={rectangle.color}
                on:change={updateRectangle}
            />
        </div>

        <div class="form-control justify-center">
            <input type="submit" class="btn btn-success" value="Apply" />
        </div>
    </form>
</div>

<style lang="postcss">
</style>
