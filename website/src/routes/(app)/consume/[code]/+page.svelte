<script lang="ts">
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

{#if data.qrCode}
    <div class="flex flex-col items-center max-w-lg mx-auto">
        <h1 class="text-3xl font-semibold">Succès!</h1>
        <h2 class="text-2xl">
            Tu as bien récupéré tes <span class="font-bold"
                >{data.qrCode.points}
            </span>points.
        </h2>
        <img src="/assets/kraken.png" class="w-64" alt="kraken" />
        <p>Tu peux maintener fermer cette page.</p>
        <div class="divider">ou</div>
        <a href="/place" class="btn btn-primary">Aller sur le KrakPlace</a>
        <div class="divider">ou</div>
        <a href="/leaderboard" class="btn btn-primary">
            Consulter le Leaderboard
        </a>
    </div>
{/if}
