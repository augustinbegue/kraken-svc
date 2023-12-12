<script lang="ts">
    import { page } from "$app/stores";
    import { hasRole, isLoggedIn } from "$lib/accounts/utils";
    import { ArrowBigLeft } from "lucide-svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<main class="min-h-screen flex flex-col">
    {#if data.profile}
        <div class="navbar" class:bg-blue-950={$page.url.pathname === "/"}>
            <div class="flex-1">
                {#if $page.url.pathname !== "/"}
                    <button class="btn btn-ghost">
                        <a href="/"><ArrowBigLeft /></a>
                    </button>
                {/if}
            </div>
            <div class="flex-none pr-4 gap-4">
                <p class="inline-flex gap-2">
                    <a
                        class="font-semibold"
                        href="https://cri.epita.fr/users/{data.profile
                            .preferred_username}"
                        target="_blank"
                    >
                        {data.profile.preferred_username}
                    </a>
                </p>
                {#if hasRole(data.profile, "STAFF")}
                    <a href="/admin" class="underline">KrakAdmin</a>
                {/if}
                <a href="/accounts/logout" class="underline">Logout</a>
            </div>
        </div>
    {/if}

    <div class="grow bg-base-100">
        <slot />
    </div>

    <footer class="footer p-4 bg-base-100 text-base-content">
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
