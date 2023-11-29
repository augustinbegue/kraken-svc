<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    let questions = [
        {
            question: "What is your favorite color?",
            answers: ["Red", "Blue"],
        },
    ];
</script>

<div class="container mx-auto flex flex-col gap-2 max-w-md">
    <h1 class="text-2xl font-bold">Questionnaire</h1>
    {#each questions as question}
        <h2 class="text-xl font-bold">{question.question}</h2>
        {#each question.answers as answer}
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">{answer}</span>
                    <input type="radio" name="radio-10" class="radio" checked />
                </label>
            </div>
        {/each}
    {/each}
</div>
