<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { ArrowBigLeft } from "lucide-svelte";
    import { onMount } from "svelte";

    let tabs = [
        { name: "Overall", active: false },
        { name: "2028", active: false },
        { name: "2027", active: false },
        { name: "2026", active: false },
        { name: "2025", active: false },
        { name: "2024", active: false },
    ];

    function gotoTab(name: string) {
        if (name === "Overall") {
            goto("/leaderboard");
            return;
        }

        goto(`/leaderboard/${name}`);
    }

    onMount(() => {
        let overall = $page.url.pathname === "/leaderboard";

        if (overall) {
            tabs = tabs.map((t) => {
                t.active = t.name === "Overall";
                return t;
            });

            return;
        } else {
            tabs = tabs.map((t) => {
                t.active = $page.url.pathname.includes(t.name);
                return t;
            });
        }
    });
</script>

<div class="navbar bg-base-100">
    <div class="flex-none">
        <a class="btn btn-square btn-ghost" href="/">
            <ArrowBigLeft />
        </a>
    </div>
</div>

<div class="flex flex-col bg-base-100 container mx-auto p-4">
    <h1 class="text-6xl font-bold font-decorated">Leaderboard</h1>
    <div
        role="tablist"
        class="tabs tabs-boxed hidden md:grid mt-4 bg-base-100 p-2 my-2 font-display tabs-lg"
    >
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

                    gotoTab(tab.name);
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

            gotoTab(e.currentTarget.value);
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
