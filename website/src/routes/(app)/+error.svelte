<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="container mx-auto p-8">
    <img src="/assets/kraken.png" class="w-64" alt="kraken" />
    <h1 class="text-2xl font-bold font-mono">
        Erreur {$page.status} - {$page.error?.message}
    </h1>
    <p>Ratio</p>
    <a href="/" class="underline">Retour au départ.</a>
</div>
