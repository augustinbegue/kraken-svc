<script>
  import { page } from "$app/stores";
  import { ExternalLink } from "lucide-svelte";
</script>

<li class="menu-title">KrakPlace</li>
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
    href="/admin/accounts"
    class:active={$page.url.pathname === "/admin/accounts"}
  >
    Gérer les utilisateurs
  </a>
</li>
