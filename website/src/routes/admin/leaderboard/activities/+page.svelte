<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

{#each data.categories as category}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div tabindex="0" class="collapse bg-base-100">
        <div class="collapse-title text-xl font-medium">
            {category.name}
        </div>
        <div class="collapse-content">
            {#each data.activities.filter((act) => act.category == category.id) as act}
                {act.name}
            {/each}
        </div>
    </div>
{/each}
