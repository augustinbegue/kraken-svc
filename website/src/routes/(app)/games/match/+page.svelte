<script lang="ts">
    import type { PageData } from "./$types";
    import questions from "./questions.json";

    let currentQuestionIndex = 0;
    let currentQuestion: {
        question: string;
        answers: string[];
    } = questions[currentQuestionIndex];
    let answers: number[] = [];

    function nextQuestion(answer: number) {
        answers.push(answer);

        if (currentQuestionIndex === questions.length - 1) {
            window.location.href = `/games/match/result?answer=${btoa(
                JSON.stringify(answers),
            )}`;
            return;
        }

        currentQuestionIndex++;
        currentQuestion = questions[currentQuestionIndex];
    }

    export let data: PageData;
</script>

<svelte:head>
    <title>Tu Préfères ? | Kraken</title>
</svelte:head>

<h1
    class="text-6xl font-bold font-decorated text-center md:text-left container mx-auto mb-6"
>
    Tu Préfères ?&nbsp;&nbsp;Kraken Edition
</h1>

<div class="container mx-auto flex flex-col gap-2 max-w-md">
    <h2 class="text-xl font-medium text-center md:text-left">
        Répond aux questions et découvre de qui tu es le plus proche!
    </h2>

    <div class="p-4">
        <h3 class="mb-2">Question {currentQuestionIndex + 1}</h3>
        <p class="mb-4 font-display text-2xl">{currentQuestion.question}</p>

        <div class="flex flex-col gap-2 font-display">
            {#each currentQuestion.answers as answer, i}
                <button
                    class="btn btn-lg btn-primary"
                    on:click={() => nextQuestion(i)}
                >
                    {answer}
                </button>
            {/each}
        </div>
    </div>
</div>
