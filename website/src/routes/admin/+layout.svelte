<script lang="ts">
    import { navigating } from "$app/stores";
    import { Menu, X } from "lucide-svelte";
    import { slide } from "svelte/transition";

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
            class="btn btn-square btn-ghost"
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
        class="menu bg-base-200 h-screen w-max absolute top-0 whitespace-nowrap"
        transition:slide={{ axis: "x" }}
    >
        <button class="btn btn-ghost w-min" on:click={() => (menuOpen = false)}>
            <X />
        </button>
        <li class="menu-title">Leaderboard</li>
        <li><a href="/admin/leaderboard/points">Ajouter des points</a></li>
        <li><a href="/admin/leaderboard/qr">Génerer un QR Code</a></li>
        <li><a href="/admin/leaderboard/activities">Activités</a></li>
        <li></li>
        <li class="menu-title">r/place</li>
        <li>
            <a href="/admin/place/edit">Editer le canvas</a>
        </li>
        <li>
            <a href="/admin/place/manage">Gérer les utilisateurs</a>
        </li>
    </ul>
{/if}
<div class="flex flex-row bg-base-200">
    <div class="grow">
        <slot />
    </div>
</div>
