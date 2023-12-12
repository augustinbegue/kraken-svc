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
    class="h-screen flex flex-row justify-center items-center"
    bind:this={element}
>
    <div class="p-2">
        <ChevronRight size="64"></ChevronRight>
    </div>
    <div class="flex flex-col justify-center">
        <h1 class="text-6xl font-bold mb-8">Roue des défis</h1>
        <div class="overflow-hidden h-[880px]">
            <div bind:this={defisContainer} class="transition-all">
                <div class="h-[400px]"></div>
                {#each list as defi, i}
                    {@const color = colors[i % colors.length]}
                    <p
                        class="font-bold text-4xl h-20 inline-flex text-center justify-center items-center w-full"
                        class:text-white={color === "#000000"}
                        class:text-black={color !== "#000000"}
                        style="background-color: {color}"
                    >
                        {defi}
                    </p>
                {/each}
                {#each list as defi, i}
                    {@const color = colors[i % colors.length]}
                    <p
                        class="font-bold text-4xl h-20 inline-flex text-center justify-center items-center w-full"
                        class:text-white={color === "#000000"}
                        class:text-black={color !== "#000000"}
                        style="background-color: {color}"
                    >
                        {defi}
                    </p>
                {/each}
                <div class="h-[400px]"></div>
            </div>
        </div>

        <div class="w-full flex flex-row justify-center mt-8">
            <button
                class="btn btn-primary btn-lg"
                on:click={() => {
                    roll();
                }}>Lancer la roue !</button
            >
        </div>
    </div>
    <div class="p-2">
        <ChevronLeft size="64"></ChevronLeft>
    </div>
</div>
