<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="flex flex-col">
    {#each data.leaderboard.entries as entry, i}
        <div
            class="grid grid-rows-1 grid-cols-12 p-4 rounded-sm gap-2"
            class:bg-base-300={i % 2 !== 0}
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
