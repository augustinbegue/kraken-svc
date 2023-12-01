<script lang="ts">
    import { page } from "$app/stores";
    import { hasRole } from "$lib/accounts/utils";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<main class="min-h-screen flex flex-col">
    {#if data.profile.roles.includes("ADMIN") || data.profile.roles.includes("STAFF")}
        <div class="navbar bg-base-200">
            <div class="flex-1"></div>
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
                <a href="/admin" class="underline">KrakAdmin</a>
            </div>
        </div>
    {/if}

    <div class="grow bg-base-200">
        <slot />
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
