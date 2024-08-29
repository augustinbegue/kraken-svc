<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        ChevronLeft,
        ChevronRight,
        Instagram,
        Twitch,
    } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { LeaderboardEntry } from "$lib/server/leaderboard/api";
    import { onDestroy, onMount } from "svelte";
    import type { Event } from "@prisma/client";
    import EventDisplay from "$lib/components/EventDisplay.svelte";
    import { page } from "$app/stores";

    export let data: PageData;

    const eventList: Event[] = data.events;
    let event = eventList[0];
    let eventI = 0;

    let leaderboardByYear = [
        {
            year: 2024,
            points: 0,
        },
        {
            year: 2025,
            points: 0,
        },
        {
            year: 2026,
            points: 0,
        },
        {
            year: 2027,
            points: 0,
        },
        {
            year: 2028,
            points: 0,
        },
    ];
    let leaderboardByProfile: LeaderboardEntry[] = [];

    let eventsInterval: NodeJS.Timeout;
    onMount(async () => {
        const res2 = await fetch("/api/leaderboard/grouped");
        const data2 = await res2.json();
        leaderboardByYear = data2;

        const res = await fetch("/api/leaderboard?limit=10");
        const data = await res.json();
        leaderboardByProfile = data.entries;

        eventsInterval = setInterval(() => {
            eventI = (eventI + 1) % eventList.length;
            event = eventList[eventI];
        }, 10000);
    });

    onDestroy(() => {
        clearInterval(eventsInterval);
    });
</script>

<svelte:head>
    <title>Kraken | Liste BDE Epita</title>
    <meta
        name="description"
        content="Le Retour du Kraken ! 🐙🏴‍☠️Votez Kraken pour votre prochain BDE Epita !"
    />
</svelte:head>

<div class="hero bg-gradient-to-b from-blue-950 to-base-100 py-32">
    <div class="hero-content flex-col lg:flex-row">
        <img
            src="assets/kraken.png"
            alt="kraken"
            class="max-w-xs lg:max-w-sm xl:max-w-md"
        />
        <div class="">
            <h1
                class="text-6xl font-bold font-decorated text-center md:text-left"
            >
                Le Retour du Kraken
            </h1>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            >
                <a
                    href="https://www.instagram.com/kraken_liste_bde"
                    target="_blank"
                    class="btn btn-primary rounded-full h-14 w-14"
                >
                    <Instagram />
                </a>
                <a
                    href="https://discord.gg/WH7S87WPN4"
                    target="_blank"
                    class="btn btn-accent rounded-full h-14 w-14"
                >
                    <img src="/assets/discord-mark-black.png" alt="Discord" />
                </a>
                <a
                    href="https://twitch.tv/krakendirect"
                    target="_blank"
                    class="btn btn-secondary rounded-full h-14 w-14"
                >
                    <Twitch />
                </a>
            </div>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            ></div>
        </div>
    </div>
</div>
<div class="container mx-auto px-4 pt-4">
    <div class="flex flex-col gap-4">
        <a class="widget-title font-display" href="/place">KrakPlace</a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="card shadow-xl bg-base-200 cursor-pointer p-0"
            on:click={(e) => {
                e.preventDefault();
                goto("/place");
            }}
        >
            <div class="card-body p-1">
                <iframe
                    class="aspect-square pointer-events-none"
                    src="/place/embed"
                    title="KrakPlace"
                >
                </iframe>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .widget-title {
        @apply text-2xl font-bold;
    }
</style>
