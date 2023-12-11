<script lang="ts">
    import { ChevronDown, ChevronUp, Menu } from "lucide-svelte";
    import { flip } from "svelte/animate";
    import { quintOut } from "svelte/easing";

    let assos = ["La Cave", "VJN", "Lateb", "La Paillotte", "L'Atelier"];
</script>

<div class="container mx-auto max-w-lg p-4">
    <h1 class="text-xl font-bold">Tierlist</h1>
    <p class="mb-2">Classe les assos d'Epita</p>
    <div class="flex flex-col gap-2">
        {#each assos as asso, i (asso)}
            <div
                class="flex flex-row gap-2 p-2 rounded-lg from-base-100 to-base-300 items-center bg-gradient-to-br"
                animate:flip={{
                    duration: 500,
                    easing: quintOut,
                }}
            >
                <div class="text-sm">
                    <button
                        class="btn btn-ghost btn-sm rounded-full"
                        disabled={i === 0}
                        on:click={() => {
                            assos = [
                                ...assos.slice(0, i - 1),
                                asso,
                                assos[i - 1],
                                ...assos.slice(i + 1),
                            ];
                        }}
                    >
                        <ChevronUp />
                    </button>

                    <button
                        disabled={i === assos.length - 1}
                        class="btn btn-ghost btn-sm rounded-full"
                        on:click={() => {
                            assos = [
                                ...assos.slice(0, i),
                                assos[i + 1],
                                asso,
                                ...assos.slice(i + 2),
                            ];
                        }}
                    >
                        <ChevronDown />
                    </button>
                </div>
                <span class="text-2xl font-medium">
                    {asso}
                </span>
            </div>
        {/each}
    </div>
</div>
