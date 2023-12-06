<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="mx-auto container p-4">
    {#if $page.error}
        <h1 class="text-xl font-bold">
            {$page.status} - {$page.error.message}
        </h1>
    {/if}
</div>
