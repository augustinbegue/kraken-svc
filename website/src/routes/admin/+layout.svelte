<script lang="ts">
</script>

<div class="flex flex-row bg-base-200">
    <ul class="menu w-56">
        <li class="menu-title">Leaderboard</li>
        <li><a href="/admin/leaderboard/points">Ajouter des points</a></li>
        <li><a href="/admin/leaderboard/qr">Génerer un QR Code</a></li>
        <li><a href="/admin/leaderboard/activities">Activités</a></li>
        <li></li>
        <li class="menu-title">r/place</li>
        <li>
            <a href="/place/edit">Editer le canvas</a>
        </li>
        <li>
            <a href="/place/manage">Gérer les utilisateurs</a>
        </li>
    </ul>
    <div class="grow">
        <slot />
    </div>
</div>
