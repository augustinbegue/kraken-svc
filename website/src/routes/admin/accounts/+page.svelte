<script lang="ts">
    import { Pencil, Trash2 } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { Profile, Role } from "@prisma/client";
    import { invalidateAll } from "$app/navigation";

    export let data: PageData;

    async function updateRoles(profile: Profile, role: Role) {
        if (profile.roles.includes(role)) {
            profile.roles = profile.roles.filter((r) => r !== role);
        } else {
            profile.roles.push(role);
        }

        const res = await fetch(`/api/accounts/edit`, {
            method: "POST",
            body: JSON.stringify({ profile }),
        });

        if (!res.ok) {
            console.error(res.statusText);
        }

        invalidateAll();
    }

    async function toggleProfile(profile: Profile) {
        profile.isActive = !profile.isActive;

        const res = await fetch(`/api/accounts/edit`, {
            method: "POST",
            body: JSON.stringify({ profile }),
        });

        if (!res.ok) {
            console.error(res.statusText);
        }

        invalidateAll();
    }

    async function deleteProfile(profile: Profile) {
        profile.isDeleted = true;

        const res = await fetch(`/api/accounts/edit`, {
            method: "POST",
            body: JSON.stringify({ profile }),
        });

        if (!res.ok) {
            console.error(res.statusText);
        }

        invalidateAll();
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold">Utilisateurs</h1>
    <p>Gérer les utilisateurs</p>

    <div class="overflow-y-hidden overflow-x-auto">
        <table class="table table-zebra">
            <!-- head -->
            <thead>
                <tr>
                    <th>Login</th>
                    <th>Roles</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each data.profiles as profile}
                    <tr>
                        <td>
                            {profile.preferred_username}
                        </td>
                        <td class="flex flex-row gap-2">
                            {#each profile.roles as role}
                                <div
                                    class="badge badge-neutral"
                                    class:badge-primary={role === "ADMIN"}
                                    class:badge-secondary={role === "STAFF"}
                                >
                                    {role}
                                </div>
                            {/each}
                            <div class="dropdown">
                                <div tabindex="0" role="button" class="m-1">
                                    <Pencil class="h-4 w-4" />
                                </div>
                                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                                <ul
                                    tabindex="0"
                                    class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                >
                                    <li>
                                        <div>
                                            <input
                                                type="checkbox"
                                                class="toggle toggle-primary"
                                                checked={profile.roles.includes(
                                                    "ADMIN",
                                                )}
                                                on:click={() => {
                                                    updateRoles(
                                                        profile,
                                                        "ADMIN",
                                                    );
                                                }}
                                            />

                                            ADMIN
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <input
                                                type="checkbox"
                                                class="toggle toggle-secondary"
                                                checked={profile.roles.includes(
                                                    "STAFF",
                                                )}
                                                on:click={() => {
                                                    updateRoles(
                                                        profile,
                                                        "STAFF",
                                                    );
                                                }}
                                            />

                                            STAFF
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <input
                                                type="checkbox"
                                                class="toggle"
                                                checked={profile.roles.includes(
                                                    "USER",
                                                )}
                                                on:click={() => {
                                                    updateRoles(
                                                        profile,
                                                        "USER",
                                                    );
                                                }}
                                            />

                                            USER
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </td>
                        <td>
                            {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td>
                            {new Date(profile.updated_at).toLocaleDateString()}
                            {new Date(profile.updated_at).toLocaleTimeString()}
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                class="toggle toggle-primary"
                                checked={profile.isActive}
                                on:click={() => {
                                    toggleProfile(profile);
                                }}
                            />
                        </td>
                        <td>
                            <button
                                type="submit"
                                class="btn btn-ghost btn-sm w-max"
                                on:click={() => {
                                    deleteProfile(profile);
                                }}
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
