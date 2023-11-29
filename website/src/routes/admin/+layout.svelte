<script lang="ts">
    import { navigating } from "$app/stores";
    import { Menu, X } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import AdminMenu from "./admin-menu.svelte";

    let menuOpen = false;

    $: {
        if ($navigating) {
            menuOpen = false;
        }
    }
</script>

<div class="navbar bg-base-100">
    <div class="flex-none">
        <button
            class="btn btn-square btn-ghost md:hidden"
            on:click={() => (menuOpen = !menuOpen)}
        >
            <Menu />
        </button>
    </div>
    <div class="flex-1">
        <span class="btn btn-ghost text-xl">KrakAdmin</span>
    </div>
    <div class="flex-none">
        <a href="/" class="underline">go back</a>
    </div>
</div>

{#if menuOpen}
    <ul
        class="menu bg-base-200 h-screen w-max absolute top-0 whitespace-nowrap md:hidden"
        transition:slide={{ axis: "x" }}
    >
        <button class="btn btn-ghost w-min" on:click={() => (menuOpen = false)}>
            <X />
        </button>
        <AdminMenu />
    </ul>
{/if}

<div class="flex flex-row bg-base-200">
    <ul class="menu hidden md:flex bg-base-200 w-max">
        <AdminMenu />
    </ul>
    <div class="grow">
        <slot />
    </div>
</div>
