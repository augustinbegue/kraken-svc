<script>
    import { page } from "$app/stores";
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
</li>
<li>
    <a
        href="/admin/place/manage"
        class:active={$page.url.pathname === "/admin/place/manage"}
    >
        Gérer les utilisateurs
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
