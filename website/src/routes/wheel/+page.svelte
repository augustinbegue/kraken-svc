<script lang="ts">
    import { PlaceCanvas } from "$lib/place/PlaceCanvas";
    import { text } from "@sveltejs/kit";
    import defis from "./defis.json";
    import { onMount } from "svelte";
    import { ChevronLeft, ChevronRight, Maximize } from "lucide-svelte";

    let element: HTMLDivElement;
    let fullscreen = true;
    const list = defis.list;
    const colors = PlaceCanvas.CANVAS_PALETTE;

    let currentI = 0;
    let pxOffset = currentI * 80;
    let fullOffset = list.length * 80;
    let defisContainer: HTMLDivElement;
    async function roll() {
        // Reset to 1st list
        pxOffset -= fullOffset;
        defisContainer.style.transitionDuration = "0ms";
        defisContainer.style.transform = `translateY(-${pxOffset}px)`;

        console.log("reset offset", pxOffset);

        await new Promise((resolve) => setTimeout(resolve, 10));

        currentI = Math.floor(Math.random() * list.length);
        pxOffset = currentI * 80 + fullOffset;

        console.log("new offset", pxOffset);

        defisContainer.style.transitionDuration = `8000ms`;
        defisContainer.style.transform = `translateY(-${pxOffset}px)`;
    }
</script>

<button
    class="btn btn-ghost"
    on:click={() => {
        element.requestFullscreen();
        fullscreen = true;
    }}
>
    <Maximize />
</button>

<div
    class="h-screen flex flex-col justify-center items-center"
    bind:this={element}
>
    <h1 class="text-8xl font-bold font-decorated my-16">
        Roue des défis du Kraken
    </h1>

    <div class="flex flex-row justify-center items-center h-full">
        <div class="p-2">
            <ChevronRight size="64"></ChevronRight>
        </div>
        <div class="overflow-hidden h-[880px] rounded-full">
            <div bind:this={defisContainer} class="transition-all">
                <div class="h-[400px]"></div>
                {#each list as defi, i}
                    {@const color = colors[i % colors.length]}
                    <p
                        class="font-bold text-4xl h-20 inline-flex text-center justify-center items-center w-full font-display"
                        class:text-white={color === "#000000"}
                        class:text-black={color !== "#000000"}
                        style="background-color: {color}"
                    >
                        <span class="mb-2">
                            {defi}
                        </span>
                    </p>
                {/each}
                {#each list as defi, i}
                    {@const color = colors[i % colors.length]}
                    <p
                        class="font-bold text-4xl h-20 inline-flex text-center justify-center items-center w-full font-display"
                        class:text-white={color === "#000000"}
                        class:text-black={color !== "#000000"}
                        style="background-color: {color}"
                    >
                        <span class="mb-2">
                            {defi}
                        </span>
                    </p>
                {/each}
                <div class="h-[400px]"></div>
            </div>
        </div>

        <div class="p-2">
            <ChevronLeft size="64"></ChevronLeft>
        </div>
    </div>

    <div class="w-full flex flex-row justify-center my-16">
        <button
            class="btn btn-primary btn-lg font-display text-3xl"
            on:click={() => {
                roll();
            }}
        >
            <span class="mb-2"> Lancer la roue ! </span>
        </button>
    </div>
</div>
