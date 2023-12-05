<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import type { Activity, Category } from "$lib/server/leaderboard/api";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    let categoryModal: Modal;
    let currentCategory: Category = {
        id: -1,
        name: "",
    };
    let activityModal: Modal;
    let currentActivity: Activity = {
        id: -1,
        name: "",
        points: 0,
        category: -1,
    };

    onMount(() => {});
</script>

<div class="container mx-auto">
    <div class="py-4 flex gap-4">
        <button
            class="btn btn-primary"
            on:click={() => {
                currentCategory = {
                    id: -1,
                    name: "",
                };
                categoryModal.open();
            }}
        >
            Ajouter une Catégorie
        </button>
        <button
            class="btn btn-primary"
            on:click={() => {
                currentActivity = {
                    id: -1,
                    name: "",
                    points: 0,
                    category: -1,
                };

                activityModal.open();
            }}
        >
            Ajouter une Activité
        </button>
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

<Modal bind:this={categoryModal}>
    <form action="?/category" method="POST">
        <input type="hidden" name="id" bind:value={currentCategory.id} />

        <div class="form-control">
            <label class="label" for="name">
                <span class="label-text">Nom</span>
            </label>
            <input
                type="text"
                placeholder="Nom"
                class="input input-bordered"
                name="name"
                bind:value={currentCategory.name}
            />
        </div>

        <div class="form-control mt-4">
            <button type="submit" class="btn btn-primary"> Enregistrer </button>
        </div>
    </form>
</Modal>

<Modal bind:this={activityModal}>
    <form action="?/activity" method="POST">
        <input type="hidden" name="id" bind:value={currentActivity.id} />

        <div class="form-control">
            <label for="name" class="label">
                <span class="label-text">Nom</span>
            </label>
            <input
                type="text"
                placeholder="Nom"
                class="input input-bordered"
                name="name"
                bind:value={currentActivity.name}
            />
        </div>

        <div class="form-control">
            <label for="points" class="label">
                <span class="label-text">Points</span>
            </label>
            <input
                type="number"
                placeholder="Points"
                class="input input-bordered"
                name="points"
                bind:value={currentActivity.points}
            />
        </div>

        <div class="form-control">
            <label for="points" class="label">
                <span class="label-text">Catégorie</span>
            </label>

            <select
                class="select select-bordered w-full max-w-xs"
                name="category"
                bind:value={currentActivity.category}
            >
                {#each data.categories as category}
                    <option value={category.id}>{category.name}</option>
                {/each}
            </select>
        </div>

        <div class="form-control mt-4">
            <button type="submit" class="btn btn-primary"> Enregistrer </button>
        </div>
    </form>
</Modal>
