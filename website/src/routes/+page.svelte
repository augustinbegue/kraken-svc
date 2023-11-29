<script lang="ts">
    import { goto } from "$app/navigation";
    import { ChevronLeft, ChevronRight } from "lucide-svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    const eventList = [
        {
            name: "Début de la campagne",
            date: "2021-09-20T00:00:00.000Z",
            description: "La campagne commence !",
        },
        {
            name: "Fin de la campagne",
            date: "2021-10-20T00:00:00.000Z",
            description: "La campagne se termine !",
        },
    ];
    let event = eventList[0];
    let eventI = 0;

    const leaderboardByYear = [
        {
            year: 2024,
            points: 105430,
        },
        {
            year: 2025,
            points: 223169,
        },
        {
            year: 2026,
            points: 321565,
        },
        {
            year: 2027,
            points: 302796,
        },
        {
            year: 2028,
            points: 316343,
        },
    ];
    const leaderboardByProfile = [
        {
            login: "augustin.begue",
            points: 2048,
        },
        {
            login: "augustin.begue",
            points: 2043,
        },
        {
            login: "augustin.begue",
            points: 1956,
        },
        {
            login: "augustin.begue",
            points: 1843,
        },
        {
            login: "augustin.begue",
            points: 1754,
        },
        {
            login: "augustin.begue",
            points: 1579,
        },
        {
            login: "augustin.begue",
            points: 1367,
        },
        {
            login: "augustin.begue",
            points: 1321,
        },
        {
            login: "augustin.begue",
            points: 1298,
        },
        {
            login: "augustin.begue",
            points: 1287,
        },
    ];
</script>

<div class="hero h-full bg-base-200">
    <div class="hero-content flex-col lg:flex-row">
        <img
            src="assets/kraken.png"
            alt="kraken"
            class="sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
        />
        <div class="">
            <h1 class="text-4xl font-bold">Liste Kraken</h1>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            >
                <a class="btn btn-primary" href="/place">Place</a>
                <a class="btn btn-primary" href="/leaderboard">Leaderboard</a>
            </div>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            ></div>
        </div>
    </div>
</div>
<div class="container mx-auto px-4 pt-4">
    <h1 class="widget-title mb-4">Top des promos</h1>
    <div class="stats shadow w-full bg-base-200">
        {#each leaderboardByYear.sort((a, b) => {
            return b.points - a.points;
        }) as entry, i}
            <div class="stat">
                <div class="stat-title text-xl">{entry.year}</div>
                <div
                    class="stat-value"
                    class:text-yellow-300={i === 0}
                    class:text-gray-400={i === 1}
                    class:text-orange-700={i === 2}
                >
                    {entry.points} <span class="text-base">pts</span>
                </div>
            </div>
        {/each}
    </div>
</div>

<div
    class="container mx-auto grid grid-cols-1 md:grid-cols-2 grid-flow-row p-4 gap-4"
>
    <div class="flex flex-col gap-4">
        <div class="widget-title">Status</div>
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                {#if data.profile}
                    <p>Signed in as {data.profile.nickname}</p>

                    <div class="card-actions">
                        <a class="btn btn-error" href="/accounts/logout">
                            Logout
                        </a>
                    </div>
                {:else}
                    <div class="card-actions">
                        <a class="btn btn-primary" href="/accounts/login/epita">
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
        <div class="widget-title">Events</div>
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                <div class="flex flex-row overflow-hidden">
                    <div
                        class="flex flex-row gap-4 justify-between shrink-0 w-full"
                    >
                        <div class="flex flex-col">
                            <div class="text-xl font-bold">
                                {event.name}
                            </div>
                            <div class="text-gray-400">
                                {event.description}
                            </div>
                        </div>
                        <div class="text-gray-400">
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div class="flex flex-row w-full justify-between items-center">
                    <button
                        class="btn btn-ghost"
                        disabled={eventList.length === 1 || eventI === 0}
                        on:click={() => {
                            eventI =
                                (eventI - 1 + eventList.length) %
                                eventList.length;
                            event = eventList[eventI];
                        }}
                    >
                        <ChevronLeft />
                    </button>
                    <span>
                        {eventI + 1} / {eventList.length}
                    </span>
                    <button
                        class="btn btn-ghost"
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
            </div>
        </div>
        <div class="widget-title">Leaderboard</div>
        <div class="card shadow-xl bg-base-200">
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
                                {profile.login}
                            </div>
                            <div class="text-gray-400">
                                {profile.points} pts
                            </div>
                        </div>
                        <div class="divider my-1"></div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-4">
        <div class="widget-title">KrakPlace</div>
        <div
            class="card shadow-xl bg-base-200 cursor-pointer"
            on:click={(e) => {
                e.preventDefault();
                goto("/place");
            }}
        >
            <div class="card-body">
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
