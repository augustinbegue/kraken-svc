<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import { onMount } from "svelte";
    import type { ActionData, PageData } from "./$types";
    import type { Event } from "@prisma/client";
    import EventDisplay from "$lib/components/EventDisplay.svelte";

    export let data: PageData;
    export let form: ActionData;

    let eventModal: Modal;
    let currentEvent: Event;

    onMount(() => {
        currentEvent = {
            id: "",
            name: "",
            description: "",
            location: "",
            startTime: new Date(),
            endTime: new Date(),
        };
    });
</script>

{#if form?.error}
    <div role="alert" class="alert alert-error mb-8">
        <span>Erreur: {form.error}</span>
    </div>
{/if}

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold">Évènements</h1>
    <p>Évènements affichés sur la page d'accueil</p>
    <div class="flex flex-row my-4">
        <button
            class="btn btn-primary btn-sm"
            on:click={() => {
                currentEvent = {
                    id: "",
                    name: "",
                    description: "",
                    location: "",
                    startTime: new Date(),
                    endTime: new Date(),
                };
                eventModal.open();
            }}
        >
            Créer un évènement
        </button>
    </div>
    <div class="flex flex-col">
        {#each data.events as event}
            <div class="flex flex-row mt-4 mb-1 gap-2">
                <button
                    class="btn btn-primary btn-sm w-max"
                    on:click={() => {
                        currentEvent = event;
                        eventModal.open();
                    }}
                >
                    Modifier
                </button>
                <form action="?/delete" method="POST">
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" class="btn btn-error btn-sm w-max">
                        Supprimer
                    </button>
                </form>
            </div>
            <EventDisplay {event}></EventDisplay>
        {/each}
    </div>
</div>

<Modal bind:this={eventModal}>
    <form action="?/upsert" method="POST">
        <input type="hidden" name="id" bind:value={currentEvent.id} />

        <!-- Event Name -->
        <div class="form-control">
            <label for="name" class="label">
                <span class="label-text">Event Name</span>
            </label>
            <input
                type="text"
                id="name"
                name="name"
                class="input input-bordered"
                bind:value={currentEvent.name}
            />
        </div>

        <!-- Event Location -->
        <div class="form-control">
            <label for="location" class="label">
                <span class="label-text">Event Location</span>
            </label>
            <input
                type="text"
                name="location"
                class="input input-bordered"
                bind:value={currentEvent.location}
            />
        </div>

        <!-- Start Date -->
        <div class="form-control">
            <label for="startTime" class="label">
                <span class="label-text">Start</span>
            </label>
            <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                class="input input-bordered"
                value={currentEvent.startTime.toISOString().slice(0, 16)}
                on:change={(e) => {
                    currentEvent.startTime = new Date(e.currentTarget.value);
                }}
            />
        </div>

        <!-- End Date -->
        <div class="form-control">
            <label for="endTime" class="label">
                <span class="label-text">End</span>
            </label>
            <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                class="input input-bordered"
                value={currentEvent.endTime.toISOString().slice(0, 16)}
                on:change={(e) => {
                    currentEvent.endTime = new Date(e.currentTarget.value);
                }}
            />
        </div>

        <!-- Event Description -->
        <div class="form-control">
            <label for="description" class="label">
                <span class="label-text">Event Description</span>
            </label>
            <textarea
                name="description"
                value={currentEvent.description}
                class="textarea textarea-bordered"
                on:change={(e) => {
                    currentEvent.description = e.currentTarget.value;
                }}
            ></textarea>
            <label for="description" class="label">
                <span class="label-text">Preview</span>
            </label>
            <EventDisplay event={currentEvent}></EventDisplay>
        </div>

        <!-- Submit -->
        <div class="form-control mt-4">
            <button type="submit" class="btn btn-primary"> Save </button>
        </div>
    </form>
</Modal>
