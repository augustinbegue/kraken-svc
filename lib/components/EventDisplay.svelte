<script lang="ts">
    import { Event } from "@prisma/client";

    export let event: Event;
</script>

<div class="card bg-secondary shadow-xl">
    <div class="card-body">
        <h2 class="card-title text-2xl inline-flex items-baseline">
            {event.name}
            <div class="badge badge-lg badge-base-100 font-display">
                {event.location}
            </div>
        </h2>
        <span class="text-sm">
            {event.startTime.toLocaleDateString()}
            {event.startTime.toLocaleTimeString()} -{" "}
            {event.endTime.toLocaleDateString()}
            {event.endTime.toLocaleTimeString()}
        </span>
        <p class="text-lg">{@html event.description}</p>
    </div>
</div>
