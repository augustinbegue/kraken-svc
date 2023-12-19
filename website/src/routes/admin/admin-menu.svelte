<script>
    import { page } from "$app/stores";
    import { ExternalLink } from "lucide-svelte";
</script>

<li class="menu-title">Leaderboard</li>
<li>
    <a
        href="/admin/leaderboard/points"
        class:active={$page.url.pathname === "/admin/leaderboard/points"}
    >
        Ajouter des points
    </a>
</li>
<li>
    <a
        href="/admin/leaderboard/qr"
        class:active={$page.url.pathname === "/admin/leaderboard/qr"}
    >
        Génerer un QR Code
    </a>
</li>
<li>
    <a
        href="/admin/leaderboard/activities"
        class:active={$page.url.pathname === "/admin/leaderboard/activities"}
    >
        Activités
    </a>
</li>
<li></li>
<li class="menu-title">r/place</li>
<li>
    <a
        href="/admin/place/edit"
        class:active={$page.url.pathname === "/admin/place/edit"}
    >
        Editer le canvas
    </a>
    <a
        href="/admin/place/history"
        class:active={$page.url.pathname === "/admin/place/edit"}
    >
        Historique du canvas
    </a>
</li>
<li></li>
<li class="menu-title">Autres</li>
<li>
    <a
        href="/admin/events"
        class:active={$page.url.pathname === "/admin/events"}
    >
        Gérer les évènements
    </a>
</li>
<li>
    <a
        href="/admin/accounts"
        class:active={$page.url.pathname === "/admin/accounts"}
    >
        Gérer les utilisateurs
    </a>
    <a href="/wheel" target="_blank">
        <ExternalLink size="14" /> Roue des défis
    </a>
</li>
