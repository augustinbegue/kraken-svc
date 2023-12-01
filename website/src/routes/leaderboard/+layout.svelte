<script lang="ts">
    import { ArrowBigLeft } from "lucide-svelte";

    let tabs = [
        { name: "Overall", active: true },
        { name: "2028", active: false },
        { name: "2027", active: false },
        { name: "2026", active: false },
        { name: "2025", active: false },
        { name: "2024", active: false },
    ];
</script>

<div class="navbar bg-base-100">
    <div class="flex-none">
        <a class="btn btn-square btn-ghost" href="/">
            <ArrowBigLeft />
        </a>
    </div>
</div>

<div class="flex flex-col bg-base-200 container mx-auto p-4">
    <h1 class="text-3xl font-bold">Leaderboard</h1>
    <div role="tablist" class="tabs tabs-boxed hidden md:grid">
        {#each tabs as tab}
            <button
                role="tab"
                class:tab-active={tab.active}
                class="tab tab-lifted"
                on:click={() => {
                    tabs = tabs.map((t) => {
                        t.active = t.name === tab.name;
                        return t;
                    });
                }}
            >
                {tab.name}
            </button>
        {/each}
    </div>

    <select
        class="select select-bordered w-full max-w-xs my-2 md:hidden"
        on:change={(e) => {
            tabs = tabs.map((t) => {
                t.active = t.name === e.currentTarget.value;
                return t;
            });
        }}
    >
        {#each tabs as tab}
            <option value={tab.name} selected={tab.active}>{tab.name}</option>
        {/each}
    </select>

    <div class="grow">
        <slot />
    </div>
</div>
