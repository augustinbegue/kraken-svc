<script lang="ts">
    import AnnouncementDisplay from "$lib/components/AnnouncementDisplay.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<AnnouncementDisplay announcement={data.currentAnnouncement} />

<div class="container mx-auto">
    <h1 class="text-3xl mb-8">Editer l'annonce</h1>
    <form action="?/update" method="post">
        <input
            type="hidden"
            name="id"
            bind:value={data.currentAnnouncement.id}
        />
        <input
            class="input input-bordered w-full mb-4"
            type="text"
            name="title"
            bind:value={data.currentAnnouncement.title}
        />
        <input
            class="input input-bordered w-full mb-4"
            type="text"
            name="description"
            bind:value={data.currentAnnouncement.description}
        />
        <input
            class="input input-bordered w-full mb-4"
            type="text"
            name="link"
            bind:value={data.currentAnnouncement.link}
        />
        <input
            class="input input-bordered w-full mb-4"
            type="text"
            name="image"
            bind:value={data.currentAnnouncement.image}
        />

        <button class="btn btn-primary" type="submit"> Enregistrer </button>
    </form>
</div>
