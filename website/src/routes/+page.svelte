<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    const eventList = [
        {
            name: "Début de la campagne",
            date: "2021-09-20T00:00:00.000Z",
            description: "La campagne commence !",
        },
    ];
</script>

<div class="hero h-full bg-base-200">
    <div class="hero-content flex-col lg:flex-row">
        <img
            src="assets/redacted.png"
            alt="redacted"
            class="sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
        />
        <div class="">
            <h1 class="text-5xl font-bold">Liste redacted</h1>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            >
                <a class="btn btn-primary" href="/place">Place</a>
                <a class="btn btn-primary" href="/leaderboard">Leaderboard</a>
            </div>
            <div
                class="flex flex-row justify-center lg:justify-start gap-4 mt-4"
            ></div>
        </div>
    </div>
</div>
<div
    class="container mx-auto grid grid-cols-1 md:grid-cols-2 grid-flow-row p-4 gap-4"
>
    <div class="flex flex-col gap-4">
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                <div class="card-title">Status</div>
                {#if data.profile}
                    <p>Signed in as {data.profile.nickname}</p>

                    <div class="card-actions">
                        <a class="btn btn-error" href="/accounts/logout">
                            Logout
                        </a>
                    </div>
                {:else}
                    <div class="card-actions">
                        <a class="btn btn-primary" href="/accounts/login/epita">
                            <img
                                class="h-6"
                                src="https://s3.cri.epita.fr/cri-intranet/img/logo.png"
                                alt="forge id"
                            />
                            Login with Forge ID
                        </a>
                    </div>
                {/if}
            </div>
        </div>
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                <div class="card-title">Events</div>
                <div class="flex flex-col overflow-hidden"></div>
            </div>
        </div>
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                <div class="card-title">Leaderboard</div>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-4">
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                <div class="card-title">KrakPlace</div>
                <iframe
                    src="/place/embed"
                    class="aspect-square"
                    title="KrakPlace"
                >
                </iframe>
            </div>
        </div>
    </div>
</div>
