<script lang="ts">
    import { page } from "$app/stores";
    import { hasRole } from "$lib/accounts/utils";
    import "../app.css";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<main class="min-h-screen flex flex-col">
    {#if hasRole(data.profile, "STAFF")}
        <div class="flex flex-row gap-2 p-4 bg-accent">
            <p>Logged in as <kbd>{data.profile.preferred_username}</kbd></p>
            <p>Roles: {data.profile.roles.join(", ")}</p>
            {#if $page.url.pathname.includes("/admin")}
                <a href="/" class="underline">Website</a>
            {:else}
                <a href="/admin" class="underline">Admin Dashboard</a>
            {/if}
        </div>
    {/if}

    <div class="grow">
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
                </a> for redacted
            </p>
        </aside>
    </footer>
</main>
