<script lang="ts">
    import { page } from "$app/stores";
    import { ChevronLeft, ChevronRight, Loader2 } from "lucide-svelte";
    import type { Leaderboard } from "$lib/server/leaderboard/api";
    import { onDestroy, onMount } from "svelte";
    import type { Unsubscriber } from "svelte/store";

    const LIMIT = 100;
    let pageNum = parseInt($page.url.searchParams.get("page") ?? "1");
    let leaderboard: Leaderboard;
    async function fetchLeaderboard() {
        const url = new URL("/api/leaderboard", window.location.origin);
        url.searchParams.set("limit", LIMIT.toString());
        if (pageNum) {
            url.searchParams.set("page", pageNum.toString());
        }

        console.log(`Fetching leaderboard from ${url.toString()}`);

        const res = await fetch(url.toString());
        leaderboard = await res.json();
    }

    let unsub: Unsubscriber;
    onMount(() => {
        unsub = page.subscribe((value) => {
            let newPage = parseInt(value.url.searchParams.get("page") ?? "1");
            if (newPage !== pageNum) {
                pageNum = newPage;
                fetchLeaderboard();
            }
        });
        fetchLeaderboard();
    });

    onDestroy(() => {
        if (unsub) unsub();
    });
</script>

<svelte:head>
    <title>Leaderboard | Kraken</title>
</svelte:head>

<div class="flex flex-col">
    {#if leaderboard}
        {#each leaderboard.entries as entry, i}
            <div
                class="grid grid-rows-1 grid-cols-12 p-4 rounded-xl gap-2 from-base-200 via-base-100 to-base-200"
                class:bg-gradient-to-r={i % 2 === 0}
            >
                <span class="inline-flex justify-end">
                    {#if (!pageNum || pageNum === 1) && i === 0}
                        🥇
                    {:else if (!pageNum || pageNum === 1) && i === 1}
                        🥈
                    {:else if (!pageNum || pageNum === 1) && i === 2}
                        🥉
                    {:else}
                        {LIMIT * (pageNum - 1) + i + 1}&nbsp;
                    {/if}
                </span>
                <span class="col-span-8 inline-flex items-baseline gap-2">
                    {entry.profile.preferred_username}
                    <span class="opacity-50 text-xs">
                        {entry.profile.graduation_years}
                    </span>
                </span>
                <span class="inline-flex justify-end"> </span>
                <span class="inline-flex justify-end col-span-2 items-baseline">
                    {entry.points}
                    <span class="text-xs">&nbsp;pts</span>
                </span>
            </div>
        {/each}
        <div class="flex flex-row justify-between">
            {#if pageNum > 1}
                <a
                    class="btn btn-ghost"
                    href={`?page=${(pageNum !== 1 ? pageNum : 2) - 1}`}
                >
                    <ChevronLeft />
                </a>
            {:else}
                <div></div>
            {/if}
            <a class="btn btn-ghost" href={`?page=${pageNum + 1}`}>
                <ChevronRight />
            </a>
        </div>
    {:else}
        <div class="w-full h-full flex flex-col justifiy-center items-center">
            <Loader2 class="w-12 h-12 animate-spin my-20" />
        </div>
    {/if}
</div>
