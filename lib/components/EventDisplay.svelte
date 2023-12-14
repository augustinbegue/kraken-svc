<script lang="ts">
    import { Event } from "@prisma/client";

    export let event: Event;
    export let color: string = "bg-primary";
</script>

<div class="card bg-{color} shadow-xl text-{color}-content">
    <div class="card-body">
        <h2 class="card-title text-xl md:text-2xl inline-flex items-baseline">
            {event.name}
            <div class="badge md:badge-lg badge-base-100 font-display">
                {event.location}
            </div>
        </h2>
        <span class="text-xs md:text-sm">
            {event.startTime.toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
            })} -{" "}
            {event.endTime.toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
            })}
        </span>
        <p class="md:text-lg">{@html event.description}</p>
    </div>
</div>
