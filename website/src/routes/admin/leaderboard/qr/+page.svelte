<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import * as QRCode from "qrcode";

    export let data: PageData;

    let qrCanvas: HTMLCanvasElement;

    onMount(() => {
        QRCode.toCanvas(qrCanvas, window.location.href, { width: 300 });
    });
</script>

<div class="container mx-auto">
    <div class="form-control">
        <canvas bind:this={qrCanvas}></canvas>
    </div>
</div>
