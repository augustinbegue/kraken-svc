<script lang="ts">
    import { fade } from "svelte/transition";

    let container: HTMLElement;
    let isOpen = false;
    export const open = () => {
        isOpen = true;
    };
    export const close = () => {
        isOpen = false;
    };
</script>

{#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        bind:this={container}
        class="modal modal-open cursor-pointer grow"
        transition:fade={{ duration: 50 }}
        on:click={close}
    >
        <div
            class="modal-box flex flex-col max-w-6xl cursor-default"
            on:click={(e) => {
                e.stopPropagation();
            }}
        >
            <slot />
        </div>
    </div>
{/if}
