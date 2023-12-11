<script lang="ts">
    import type { PageData } from "./$types";
    import questions from "./questions.json";

    let currentQuestionIndex = 0;
    let currentQuestion: {
        question: string;
        answers: string[];
    } = questions[currentQuestionIndex];

    function nextQuestion(answer: number) {
        currentQuestionIndex++;
        currentQuestion = questions[currentQuestionIndex];
    }

    export let data: PageData;
</script>

<div class="container mx-auto flex flex-col gap-2 max-w-md">
    <h1 class="text-2xl font-bold">Questionnaire</h1>
    <h2 class="text-xl font-medium">test</h2>

    <div class="my-4">
        <h3 class="text-lg font-medium">Question {currentQuestionIndex + 1}</h3>
        <p class="mb-2">{currentQuestion.question}</p>

        <div class="flex flex-col gap-2">
            {#each currentQuestion.answers as answer, i}
                <button
                    class="btn btn-primary"
                    on:click={() => nextQuestion(i)}
                >
                    {answer}
                </button>
            {/each}
        </div>
    </div>
</div>
