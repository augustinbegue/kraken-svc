<script lang="ts">
    import { ArrowBigLeft } from "lucide-svelte";
</script>

<div class="navbar bg-base-100">
    <div class="flex-none">
        <a class="btn btn-square btn-ghost" href="/">
            <ArrowBigLeft />
        </a>
    </div>
</div>

<div class="flex flex-col bg-base-200 container mx-auto">
    <div role="tablist" class="tabs tabs-boxed">
        <a role="tab" class="tab tab-active">Overall</a>
        <a role="tab" class="tab">2028</a>
        <a role="tab" class="tab">2027</a>
        <a role="tab" class="tab">2026</a>
        <a role="tab" class="tab">2025</a>
        <a role="tab" class="tab">2024</a>
    </div>
    <div class="grow">
        <slot />
    </div>
</div>
