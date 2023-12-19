<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Announcement } from "@prisma/client";

    let displayAlert = true;

    export let announcement: Announcement;
</script>

{#if announcement && displayAlert}
    <div
        class="fixed m-4 bottom-0 right-0 card card-compact bg-base-100 shadow-xl z-[100]"
        class:image-full={announcement.image}
        class:bg-secondary={!announcement.image}
        transition:fade={{ duration: 300 }}
    >
        {#if announcement.image}
            <figure>
                <img src={announcement.image} alt="Shoes" />
            </figure>
        {/if}
        <div class="card-body relative">
            <button
                class="btn btn-ghost btn-sm absolute top-0 right-0 m-4"
                on:click={() => (displayAlert = false)}
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M12 10.586l4.95-4.95a1 1 0 111.414 1.414L13.414 12l4.95 4.95a1 1 0 11-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 11-1.414-1.414L10.586 12 5.636 7.05a1 1 0 111.414-1.414L12 10.586z"
                    ></path>
                </svg>
            </button>
            <h2 class="card-title">{announcement.title}</h2>
            <p>{@html announcement.description}</p>
            {#if announcement.link}
                <div class="card-actions justify-end">
                    <a
                        class="btn btn-primary btn-sm"
                        href={announcement.link}
                        target="_blank"
                    >
                        voir
                    </a>
                </div>
            {/if}
        </div>
    </div>
{/if}
