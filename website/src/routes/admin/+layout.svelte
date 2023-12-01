<script lang="ts">
    import { navigating } from "$app/stores";
    import { Menu, X } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import AdminMenu from "./admin-menu.svelte";
    import type { LayoutData } from "./$types";

    let menuOpen = false;

    export let data: LayoutData;

    $: {
        if ($navigating) {
            menuOpen = false;
        }
    }
</script>

<main class="min-h-screen flex flex-col" data-theme="dim">
    <div class="grow bg-base-200">
        <div class="navbar bg-base-200">
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
            <div class="flex-none pr-4 gap-4">
                <p class="inline-flex gap-2">
                    logged in as <a
                        class="font-semibold"
                        href="https://cri.epita.fr/users/{data.profile
                            .preferred_username}"
                        target="_blank"
                    >
                        {data.profile.preferred_username}
                    </a>
                </p>
                <a href="/" class="underline">go back</a>
            </div>
        </div>

        {#if menuOpen}
            <ul
                class="menu bg-base-100 h-screen w-screen absolute top-0 whitespace-nowrap md:hidden"
                transition:slide={{ axis: "x" }}
            >
                <button
                    class="btn btn-ghost w-min"
                    on:click={() => (menuOpen = false)}
                >
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
    </div>

    <footer class="footer p-4 bg-base-300 text-base-content">
        <aside>
            <p
                class="uppercase font-semibold text-base-content text-opacity-50"
            >
                developped by <a
                    href="https://begue.cc"
                    class="underline"
                    target="_blank"
                >
                    Augustin BÉGUÉ
                </a> for kraken
            </p>
        </aside>
    </footer>
</main>
