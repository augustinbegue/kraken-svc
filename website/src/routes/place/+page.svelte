<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { ArrowBigLeft, Brush, Loader2 } from "lucide-svelte";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import type { Writable } from "svelte/store";
    import type { PageData } from "./$types";
    import type { WSMessagePlaceUpdate } from "$lib/websocket";
    import type { TileInfo } from "@prisma/client";

    export let data: PageData;

    // Palette
    const palette = PlaceCanvas.CANVAS_PALETTE;
    let activeColor = palette[0];
    let showFullPalette = false;

    // Place Canvas
    let canvas: HTMLCanvasElement;
    let cursor: HTMLDivElement;
    let placeCanvas: PlaceCanvas;
    let interactionEnabled: Writable<boolean>;

    // Websocket
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

    // Cooldown
    let lastPlacedDate = data.placeProfile.lastPlaced.getTime();
    let cooldown = 0;
    function computeCooldown() {
        const now = Date.now();
        const diff = lastPlacedDate + PlaceCanvas.COOLDOWN - now;
        cooldown = Math.max(0, diff);

        if (cooldown > 0) {
            setTimeout(computeCooldown, 1000 / 60);
        }
    }

    // Tile Info
    let tileTooltip: HTMLDivElement;

    // Place Requests
    function sendUpdate(x: number, y: number, color: string) {
        ws.send(
            JSON.stringify({
                type: "place.update",
                data: {
                    x,
                    y,
                    color,
                },
            }),
        );
        lastPlacedDate = Date.now();
        computeCooldown();
    }
    async function getTileInfo(x: number, y: number) {
        const i = placeCanvas.getIndexFromCanvasCoords(x, y);

        console.log("getTileInfo", x, y, i);

        const res = await fetch(`/api/place/tile/${i}`);

        if (!res.ok) {
            console.error("Unable to fetch tile info", res);
            return;
        }

        return (await res.json()) as TileInfo;
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
        placeCanvas = new PlaceCanvas(canvas, cursor, board.tiles);
        interactionEnabled = placeCanvas.interactionEnabled;
        placeCanvas.onTileClick = async (event, x, y) => {
            const info = await getTileInfo(x, y);
            if (!info) return;

            tileTooltip.style.left = `${event.clientX}px`;
            tileTooltip.style.top = `${event.clientY}px`;
            tileTooltip.classList.add("tooltip-open");
            tileTooltip.attributes.getNamedItem("data-tip")!.value =
                `x: ${x}, y: ${y} | ${info.login} | ${new Date(
                    info.placedAt,
                ).toLocaleDateString()} ${new Date(
                    info.placedAt,
                ).toLocaleTimeString()}`;
        };
        placeCanvas.onMove = (_, dragging) => {
            if (dragging) tileTooltip.classList.remove("tooltip-open");
        };

        computeCooldown();
    });

    onDestroy(() => {
        document.getElementsByTagName("html")[0].style.overflow = "auto";
        document.getElementsByTagName("body")[0].style.overflow = "auto";
        if (wsInitialized) ws.close();
    });
</script>

<div class="buttons" transition:fade>
    <a class="btn btn-primary rounded-full" href="/">
        <ArrowBigLeft />
    </a>
</div>

<div
    bind:this={tileTooltip}
    class="tooltip absolute z-50"
    style="left: 500px; top: 500px;"
    data-tip="primary"
></div>

{#if placeCanvas}
    {#if $interactionEnabled}
        <div class="controls" transition:slide>
            <div class="palette">
                {#if showFullPalette}
                    <div class="full-palette">
                        {#each palette as color}
                            <button
                                class="color"
                                style="background-color: {color};"
                                class:outline={color === activeColor}
                                on:click={() => {
                                    activeColor = color;
                                }}
                            ></button>
                        {/each}
                    </div>
                {/if}
                <div class="selector">
                    <button
                        class="color outline"
                        style="background-color: {activeColor};"
                        on:click={() => {
                            showFullPalette = !showFullPalette;
                        }}
                    >
                    </button>
                    <button
                        class="color"
                        disabled={cooldown > 0}
                        on:click={() => {
                            let cursorBounds = cursor.getBoundingClientRect();
                            const { x, y } =
                                placeCanvas.getCanvasCoordsFromScreenCoords(
                                    cursorBounds.left,
                                    cursorBounds.top,
                                );
                            sendUpdate(x, y, activeColor);
                        }}
                        style="
                    background-size: 100% 100%;
                    background-position: 0px 0px;
                    background-image: conic-gradient(from 0deg at 50% 50%, #FFFFFF00 0%, #FFFFFF00 {(1 -
                            cooldown / (60 * 1000)) *
                            100}%, #FF000050 {(1 - cooldown / (60 * 1000)) *
                            100}%, #FF000050 99%);
                    "
                    >
                        <Brush
                            class="{cooldown > 0
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-white cursor-pointer'} ml-1 lg:ml-2"
                        />
                    </button>
                </div>
            </div>
        </div>
    {/if}
{:else}
    <div class="flex flex-col justify-center items-center gap-4 h-[90vh]">
        <Loader2 class="animate-spin" size="36" />
        <p>{loadingState}</p>
    </div>
{/if}

<div class="cursor absolute" bind:this={cursor}></div>

<canvas class="canvas" bind:this={canvas} transition:fade> </canvas>

<style lang="postcss">
    .canvas {
        @apply absolute top-0 left-0;
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
        @apply flex flex-col gap-4 p-4 bg-base-200 rounded-t-xl items-center;
    }

    .controls .palette .full-palette {
        @apply flex flex-row flex-wrap gap-4 justify-center items-center  max-w-lg md:max-w-xl lg:max-w-3xl;
    }

    .controls .palette .selector {
        @apply flex flex-row gap-4 justify-center items-center;
    }

    .controls .palette .color {
        @apply w-4 h-4 text-xs md:text-lg md:w-8 md:h-8 rounded-full;
    }

    .controls .palette .selector .color {
        @apply w-6 h-6 md:w-10 md:h-10;
    }

    .cursor {
        @apply absolute top-0 left-0 outline-black outline z-40 rounded-full w-6 h-6;
    }
</style>
