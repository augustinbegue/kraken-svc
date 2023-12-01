<script lang="ts">
    import { page } from "$app/stores";
    import { hasRole } from "$lib/accounts/utils";
    import "../app.css";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<main class="min-h-screen flex flex-col">
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
