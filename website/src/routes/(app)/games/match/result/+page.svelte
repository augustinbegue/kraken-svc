<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let membres = [
        "Alessio",
        "Alexiane",
        "Anthony",
        "Arthur",
        "Augustin",
        "Dean",
        "Elias",
        "Enzio",
        "Grégoire",
        "Gustave",
        "Lea",
        "Lina",
        "Louis",
        "Marius",
        "Mathias",
        "Paul",
        "Pierre",
        "Titouan",
        "Wassim",
    ];

    let memberIndex = 0;
    onMount(() => {
        const anwser = $page.url.searchParams.get("answer");

        if (!anwser) {
            goto("/games/match");
            return;
        }

        for (let i = 0; i < anwser.length; i++) {
            memberIndex += anwser.charCodeAt(i);
        }

        memberIndex = memberIndex % membres.length;
    });
</script>

<div class="container mx-auto flex flex-col gap-2 max-w-md">
    <h1 class="text-6xl font-bold font-decorated text-center md:text-left">
        Tu Préfères ?&nbsp;&nbsp;Kraken Edition
    </h1>
    <h2 class="text-xl font-medium text-center md:text-left">
        Voici ton Résultat !
    </h2>

    <div class="p-4">
        <h3 class="mb-2">Tu es le plus proche de :</h3>
        <p class="mb-4 font-display text-2xl">{membres[memberIndex]}</p>

        <div class="p-4">
            <img src="/assets/pokemon/{membres[memberIndex]}.png" alt="" />
        </div>

        <div class="flex flex-col gap-2 font-display">
            <button
                class="btn btn-lg btn-primary"
                on:click={() => goto("/games/match")}
            >
                Rejouer
            </button>
        </div>
    </div>
</div>
