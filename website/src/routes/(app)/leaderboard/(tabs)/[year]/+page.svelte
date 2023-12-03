<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import type {
        Leaderboard,
        LeaderboardEntry,
    } from "$lib/server/leaderboard/api";
    import { browser } from "$app/environment";

    export let data: PageData;
    let entries: LeaderboardEntry[] = [];

    $: {
        if (browser) {
            fetchLeaderboard(parseInt($page.params.year));
        }
    }

    async function fetchLeaderboard(year: number) {
        const res = await fetch(`/api/leaderboard/${year}`);

        const leaderboard = (await res.json()) as Leaderboard;
        entries = leaderboard.entries;
    }
</script>

<div class="flex flex-col">
    {#each entries as entry, i}
        <div
            class="grid grid-rows-1 grid-cols-12 p-4 rounded-xl gap-2"
            class:neumorphic={i % 2 !== 0}
        >
            <span class="inline-flex justify-end">
                {#if i === 0}
                    🥇
                {:else if i === 1}
                    🥈
                {:else if i === 2}
                    🥉
                {:else}
                    {i + 1}&nbsp;
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
</div>
