<script lang="ts">
    import { onMount } from "svelte";
    import type { ActionData } from "./$types";
    import { CheckCircle } from "lucide-svelte";

    export let form: ActionData;
</script>

<div class="container mx-auto p-4">
    {#if form?.success}
        <div role="alert" class="alert alert-success mb-8">
            <CheckCircle></CheckCircle>
            <span>Succès!</span>
        </div>
    {:else if form?.error}
        <div role="alert" class="alert alert-error mb-8">
            <span>Erreur: {form.error}</span>
        </div>
    {/if}
    <form
        method="post"
        action="?/add"
        class="grid gap-4 grid-flow-row md:grid-cols-2"
    >
        <div class="form-control">
            <label for="points">Nombre de points</label>
            <input
                type="number"
                name="points"
                id="points"
                class="input input-bordered"
                placeholder="69"
            />
        </div>
        <div class="form-control">
            <label for="reason">Login</label>
            <input
                type="text"
                name="login"
                id="login"
                class="input input-bordered"
                placeholder="pierre.pagnoux"
            />
        </div>
        <div class="form-control">
            <input
                type="submit"
                class="btn btn-success w-max"
                value="Ajouter"
            />
        </div>
    </form>
</div>
