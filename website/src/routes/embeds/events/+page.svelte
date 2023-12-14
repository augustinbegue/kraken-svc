<script lang="ts">
    import EventDisplay from "$lib/components/EventDisplay.svelte";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import type { Event } from "@prisma/client";

    export let data: PageData;
    let currentEvent: Event = data.events[0];
    let currentEventIndex = 0;

    let colors = ["primary", "secondary", "accent"];
    let colorIndex = 0;
    onMount(() => {
        setInterval(() => {
            currentEventIndex = (currentEventIndex + 1) % data.events.length;
            currentEvent = data.events[currentEventIndex];

            colorIndex = (colorIndex + 1) % colors.length;
        }, 1000 * 10);
    });
</script>

<EventDisplay event={currentEvent} color={colors[colorIndex]} />
