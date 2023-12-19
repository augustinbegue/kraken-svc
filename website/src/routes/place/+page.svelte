<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { ArrowBigLeft, Brush, Loader2 } from "lucide-svelte";
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import type { Writable } from "svelte/store";
    import type { PageData } from "./$types";
    import type { WSMessagePlaceUpdate } from "$lib/websocket";
    import type { TileInfo } from "@prisma/client";
    import { dev } from "$app/environment";
    import type { ApiTileDrawBody } from "../api/place/tile/draw/+server";
    import { PlaceWebsocketHandler } from "$lib/websocket/PlaceWebsocketHandler";
    import Modal from "$lib/components/Modal.svelte";
    import AnnouncementDisplay from "$lib/components/AnnouncementDisplay.svelte";

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
    let wsHandler: PlaceWebsocketHandler;

    // Rules
    let rulesModal: Modal;

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
    async function sendUpdate(x: number, y: number, color: string) {
        if (cooldown > 0) return;

        const body: ApiTileDrawBody = {
            x,
            y,
            color,
        };
        const res = await fetch(`/api/place/tile/draw`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        lastPlacedDate = Date.now();
        computeCooldown();
    }
    async function getTileInfo(x: number, y: number) {
        const i = placeCanvas.getIndexFromCanvasCoords(x, y);

        const res = await fetch(`/api/place/tile/${i}`);

        if (!res.ok) {
            return;
        }

        return (await res.json()) as TileInfo;
    }

    const reopening = 1702580400000;
    let countdown = reopening - Date.now();
    $: hours = Math.floor(countdown / 1000 / 60 / 60);
    $: minutes = Math.floor((countdown / 1000 / 60) % 60);
    $: seconds = Math.floor((countdown / 1000) % 60);
    const interval = setInterval(() => {
        countdown = reopening - Date.now();
    }, 1000);

    let loadingState = "Loading canvas...";
    onMount(async () => {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";

        const res = await fetch(`/api/place/canvas`);
        if (!res.ok) {
            loadingState = "Error: Unable to load canvas.";
            return;
        }
        const board = await res.json();
        placeCanvas = new PlaceCanvas(canvas, cursor, board.tiles);
        interactionEnabled = placeCanvas.interactionEnabled;
        placeCanvas.onTileClick = async (event, x, y) => {
            let info: TileInfo | undefined;
            try {
                info = await getTileInfo(x, y);
            } catch (error) {
            } finally {
                if (!info) {
                    tileTooltip.classList.remove("tooltip-open");
                    return;
                }
            }

            tileTooltip.style.left = `${event.clientX}px`;
            tileTooltip.style.top = `${event.clientY}px`;
            tileTooltip.classList.add("tooltip-open");

            tileTooltip.attributes.getNamedItem("data-tip")!.value =
                `x: ${x}, y: ${y} | ${info.login} | ${new Date(
                    info.placedAt,
                ).toLocaleString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                })}`;
        };
        placeCanvas.onMove = (_, dragging) => {
            if (dragging) tileTooltip.classList.remove("tooltip-open");
        };

        loadingState = "Connecting to websocket...";
        wsHandler = new PlaceWebsocketHandler(data.wsUrl, placeCanvas);
        wsHandler.onReady = () => {
            loadingState = "";

            rulesModal.open();
        };

        computeCooldown();
    });

    onDestroy(() => {
        document.getElementsByTagName("html")[0].style.overflow = "auto";
        document.getElementsByTagName("body")[0].style.overflow = "auto";
        if (wsHandler) wsHandler.destroy();

        clearInterval(interval);
    });
</script>

<svelte:head>
    <title>KrakPlace | Kraken</title>
</svelte:head>

<AnnouncementDisplay announcement={data.currentAnnouncement} />

<div
    class="flex flex-row gap-4 absolute top-0 w-screen justify-between items-center z-50 bg-base-100 opacity-40 p-2"
>
    <a class="btn btn-sm btn-ghost" href="/">
        <ArrowBigLeft />
    </a>

    <p>
        Logged in as {data.profile.preferred_username}
    </p>
</div>

<div
    bind:this={tileTooltip}
    class="tooltip absolute z-50"
    style="left: 500px; top: 500px;"
    data-tip="primary"
></div>

{#if loadingState.length === 0}
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
                        on:click={async () => {
                            let cursorBounds = cursor.getBoundingClientRect();
                            const { x, y } =
                                placeCanvas.getCanvasCoordsFromScreenCoords(
                                    cursorBounds.left,
                                    cursorBounds.top,
                                );
                            await sendUpdate(x, y, activeColor);
                        }}
                        style="
                    background-size: 100% 100%;
                    background-position: 0px 0px;
                    background-image: conic-gradient(from 0deg at 50% 50%, #FFFFFF00 0%, #FFFFFF00 {(1 -
                            cooldown / PlaceCanvas.COOLDOWN) *
                            100}%, #FF000050 {(1 -
                            cooldown / PlaceCanvas.COOLDOWN) *
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
    <div class="flex flex-col justify-center items-center gap-4 h-[90vh] z-50">
        <Loader2 class="animate-spin" size="36" />
        <p>{loadingState}</p>
    </div>
{/if}

<div class="cursor absolute" bind:this={cursor}></div>

<canvas class="canvas" bind:this={canvas}> </canvas>

<Modal bind:this={rulesModal}>
    <div class="container mx-auto">
        {#if countdown <= 0}
            <h1 class="text-6xl font-decorated">KrakPlace</h1>
            <p>Bienvenue sur le KrakPlace!</p>
            <h2 class="text-xl">Les Règles</h2>
            <p>
                Pour pouvoir participer, tu dois prendre en compte ces quelques
                règles:
            </p>
            <ul class="list-decimal ml-4">
                <li>Chaque pixel placé te donne un point au Leaderboard.</li>
                <li>
                    Tu n'as pas le droit de dessiner des choses offensives ou
                    obscènes.
                </li>
                <li>
                    L'utilisation de bot ou de tout autre moyen pour contourner
                    les modalités du jeu sont interdits.
                </li>
                <li>
                    La Liste Kraken se réserve le droit de restreindre l'accès
                    au site et de signaler les comptes ne respectant pas les
                    règles énoncés ci-dessus.
                </li>
                <li>
                    La Liste Kraken décline toute responsabilité concernant le
                    contenu présent sur cet espace. Toute personne participante
                    s'engage en tant qu'individu et non au nom de quelquonque
                    entite ou organisation.
                </li>
            </ul>
            <h2 class="text-xl mt-2">Comment Jouer</h2>
            <ul class="list-decimal ml-4">
                <li>
                    Zoom sur le canvas jusqu'a ce que la palette apparaisse.
                </li>
                <li>
                    Tu peux séléctionner un pixel sur le canvas en maintenant le
                    clic gauche et en bougeant ta souris.
                </li>
                <li>
                    Choisis une couleur dans la palette et clique sur le pinceau
                    pour dessiner.
                </li>
                <li>
                    Tu peux aussi cliquer sur une case pour voir qui l'a modifé
                    et quand.
                </li>
                <li>
                    Si tu rencontre des problèmes, assure toi d'etre sur un
                    pc/laptop avec chrome.
                </li>
            </ul>
            <button
                class="btn btn-primary w-full mt-4"
                on:click={() => {
                    rulesModal.close();
                }}
            >
                Compris!
            </button>
        {:else}
            <div class="flex flex-row items-center w-full justify-center">
                <img src="/assets/kraken.png" class="max-w-xs" />
                <div>
                    <h1 class="text-6xl font-decorated">KrakPlace</h1>
                    <p class="text-2xl font-bold font-display">
                        Le Kraken a du replonger dans les abysses.
                        <br />
                        Il sera de retour dans {hours}h {minutes}m {seconds}s.
                    </p>
                </div>
            </div>
        {/if}
    </div>
</Modal>

<style lang="postcss">
    :root {
        @apply bg-base-200;
    }
    .canvas {
        @apply absolute top-0 left-0;
        transition: transform 0.1s linear;
        image-rendering: pixelated;
    }
    .controls {
        @apply flex flex-row gap-4 absolute bottom-0 w-screen justify-center z-50;
    }
    .controls .palette {
        @apply flex flex-col gap-4 p-4 bg-base-100 items-center rounded-t-2xl;
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
