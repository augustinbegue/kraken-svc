<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="container mx-auto">
    <div class="py-4 flex gap-4">
        <button class="btn btn-primary" disabled>
            Ajouter une Catégorie
        </button>
        <button class="btn btn-primary" disabled> Ajouter une Activité </button>
    </div>

    <div class="flex flex-col gap-2">
        {#each data.categories as category}
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <div tabindex="0" class="collapse bg-base-100">
                <div class="collapse-title text-xl font-medium">
                    {category.name}
                </div>
                <div class="collapse-content">
                    {#each data.activities.filter((act) => act.category == category.id) as act}
                        <div>
                            {act.name} - {act.points} pts
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
