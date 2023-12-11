<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { toDataURL } from "qrcode";
    import Modal from "$lib/components/Modal.svelte";
    import type { QRCode } from "@prisma/client";

    export let data: PageData;

    let qrModal: Modal;
    let qrDataUrl: string = "";
    let qrLink: string = "";
    let maxUses = 0;

    async function createQRCode(
        activityId: number,
        points: number,
        maxUses: number,
    ) {
        const res = await fetch(`/api/qr/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                activityId,
                points,
                maxUses,
            }),
        });

        const qrCode = (await res.json()) as QRCode;
        qrLink = `https://liste.bdekraken.fr/consume/${btoa(qrCode.id)}`;
        qrDataUrl = await toDataURL(qrLink, {
            errorCorrectionLevel: "L",
            margin: 1,
            width: 1024,
        });

        qrModal.open();
    }
</script>

<Modal bind:this={qrModal}>
    <div class="flex flex-col items-center">
        <h1 class="text-2xl font-semibold">QR Code</h1>
        <p>Scanne ce QR Code pour obtenir tes points!</p>
        <img src={qrDataUrl} alt="QR Code" class="max-w-lg w-full p-4" />
        <a class="text-sm underline" href={qrLink}>{qrLink}</a>
    </div>
</Modal>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold">QR Codes</h1>
    <p>Cliquer sur une des activités pour génerer un QR Code</p>

    <div class="mt-2 mb-4">
        <span>
            Nombre d'utilisations maximum: {maxUses === 0 ? "∞" : maxUses}
        </span>
        <input
            type="range"
            min="0"
            max="100"
            value="0"
            step="5"
            class="range range-xs"
            on:change={(e) => {
                maxUses = e.currentTarget.valueAsNumber;
            }}
        />
    </div>

    {#each data.categories as category}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="my-4">
            <h2 class="text-xl font-medium mb-2">
                {category.name}
            </h2>
            <div class="flex flex-row gap-2">
                {#each data.activities.filter((act) => act.category == category.id) as act}
                    <button
                        class="btn btn-ghost bg-base-100"
                        on:click={() =>
                            createQRCode(act.id, act.points, maxUses)}
                    >
                        {act.name} ({act.points} pts)
                    </button>
                {/each}
            </div>
        </div>
        <div class="divider"></div>
    {/each}
</div>
