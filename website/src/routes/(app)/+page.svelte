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

<div class="hero bg-gradient-to-b from-blue-950 to-base-100 py-32">
    <div class="hero-content flex-col lg:flex-row">
        <img
            src="assets/kraken.png"
            alt="kraken"
            class="max-w-xs lg:max-w-sm xl:max-w-md"
        />
        <div class="">
            <h1 class="text-6xl font-bold font-decorated">
                Le Retour du Kraken
            </h1>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            >
                <a
                    href=""
                    target="_blank"
                    class="btn btn-primary rounded-full h-14 w-14"
                >
                    <Instagram />
                </a>
                <a
                    href="https://discord.gg/v6hFZypaDQ"
                    target="_blank"
                    class="btn btn-accent rounded-full h-14 w-14"
                >
                    <img src="/assets/discord-mark-black.png" alt="Discord" />
                </a>
                <a
                    href=""
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
<div class="container mx-auto px-8 pt-4">
    <a class="widget-title font-display" href="/leaderboard">
        Top des promos
    </a>
    <div
        class="stats shadow w-full bg-gradient-to-r from-secondary to-accent mt-4"
    >
        {#each leaderboardByYear.sort((a, b) => {
            return b.points - a.points;
        }) as entry, i}
            <div
                class="stat"
                class:opacity-100={i === 0}
                class:opacity-80={i === 1}
                class:opacity-60={i === 2}
                class:opacity-40={i > 2}
            >
                <div class="stat-title text-xl text-base-100">
                    {entry.year}
                </div>
                <div class="stat-value text-base-100">
                    {entry.points} <span>pts</span>
                </div>
            </div>
        {/each}
    </div>
</div>
<div
    class="container mx-auto grid grid-cols-1 md:grid-cols-2 grid-flow-row p-8 gap-8"
>
    <div class="flex flex-col gap-4">
        <h2 class="widget-title">Events</h2>
        <EventDisplay {event}></EventDisplay>
        <div class="flex flex-row w-full justify-between items-center">
            <button
                class="btn btn-ghost btn-sm"
                disabled={eventList.length === 1 || eventI === 0}
                on:click={() => {
                    eventI = (eventI - 1 + eventList.length) % eventList.length;
                    event = eventList[eventI];
                }}
            >
                <ChevronLeft />
            </button>
            <span class="text-sm">
                {eventI + 1} / {eventList.length}
            </span>
            <button
                class="btn btn-ghost btn-sm"
                disabled={eventList.length === 1 ||
                    eventI === eventList.length - 1}
                on:click={() => {
                    eventI = (eventI + 1) % eventList.length;
                    event = eventList[eventI];
                }}
            >
                <ChevronRight />
            </button>
        </div>
        <a class="widget-title font-display" href="/leaderboard">Leaderboard</a>
        <div class="card bg-gradient-to-br from-base-200 to-base-300">
            <div class="card-body">
                <div class="flex flex-col">
                    {#each leaderboardByProfile as profile, i}
                        <div class="flex flex-row justify-between">
                            <div class="text-xl font-bold">
                                {#if i == 0}
                                    🥇
                                {:else if i == 1}
                                    🥈
                                {:else if i == 2}
                                    🥉
                                {:else}
                                    {i + 1}.{" "}
                                {/if}
                                {profile.profile.preferred_username}
                            </div>
                            <div class="font-medium">
                                {profile.points} pts
                            </div>
                        </div>
                        <div class="divider my-1"></div>
                    {/each}
                    <a
                        href="/leaderboard"
                        class="btn btn-primary btn-outline font-display"
                    >
                        Leaderboard Complet
                    </a>
                </div>
            </div>
        </div>
        <h2 class="widget-title">Instagram</h2>
        <div class="card bg-gradient-to-br from-base-200 to-base-300">
            <div class="card-body flex flex-row justify-center">
                <!-- svelte-ignore a11y-missing-attribute -->
                <iframe
                    class="w-full"
                    height="560"
                    id="instagram-embed-1"
                    src="https://www.instagram.com/tagueo/embed"
                    allowtransparency={true}
                    allowfullscreen={true}
                    frameborder="0"
                    data-instgrm-payload-id="instagram-media-payload-1"
                    scrolling="no"
                    style="background: white; max-width: 540px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"
                ></iframe>
            </div>
        </div>
    </div>
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

        <h2 class="widget-title">Infos</h2>

        <div class="flex flex-row gap-2 font-display">
            <a class="btn btn-lg btn-primary grow" href="/programme"
                >Lire le Programme</a
            >
            <a class="btn btn-lg btn-secondary grow" href="/games/match"
                >Tu Préfères ?</a
            >
        </div>

        <div class="card bg-gradient-to-br from-base-200 to-base-300">
            <div class="card-body">
                {#if data.profile}
                    <div class="flex flex-row justify-between w-full">
                        <p>
                            {data.profile.preferred_username} -
                            <span class="font-bold">
                                {data.leaderboardEntry?.points ?? 0}
                            </span>
                            points
                        </p>
                        <a href="/accounts/logout" class="underline">Logout</a>
                    </div>
                {:else}
                    <div class="card-actions">
                        <a
                            class="btn btn-primary btn-outline"
                            href="/accounts/login/epita"
                        >
                            <img
                                class="h-6"
                                src="https://s3.cri.epita.fr/cri-intranet/img/logo.png"
                                alt="forge id"
                            />
                            Login with Forge ID
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .widget-title {
        @apply text-2xl font-bold;
    }
</style>
