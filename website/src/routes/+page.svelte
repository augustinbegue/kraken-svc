<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
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
            >
                {#if data.profile}
                    <p>Signed in as {data.profile.nickname}</p>

                    <a class="btn btn-error" href="/accounts/logout">
                        Logout
                    </a>
                {:else}
                    <a class="btn btn-primary" href="/accounts/login/epita">
                        <img
                            class="h-6"
                            src="https://s3.cri.epita.fr/cri-intranet/img/logo.png"
                            alt="forge id"
                        />
                        Login with Forge ID
                    </a>
                {/if}
            </div>
        </div>
    </div>
</div>
