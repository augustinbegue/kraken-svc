<script lang="ts">
    import { Event } from "@prisma/client";

    export let event: Event;
</script>

<div class="card bg-secondary shadow-xl">
    <div class="card-body">
        <h2 class="card-title">
            {event.name}
            <div class="badge badge-base-100">
                {event.location}
            </div>
        </h2>
        <span class="text-sm">
            {event.startTime.toLocaleDateString()}
            {event.startTime.toLocaleTimeString()} -{" "}
            {event.endTime.toLocaleDateString()}
            {event.endTime.toLocaleTimeString()}
        </span>
        <p>{@html event.description}</p>
    </div>
</div>
