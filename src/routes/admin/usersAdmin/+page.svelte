<script lang="ts">
    import { onMount } from 'svelte';

    interface User {
        id: string;
        name: string | null;
        surname: string | null;
        email: string;
        role: string;
    }

    let users: User[] = [];
    let isLoading = true;
    let currentUserId: string | null = null;

    async function fetchUsers() {
        isLoading = true;

        const response = await fetch('/api/users');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                users = data.users;
                currentUserId = data.currentUserId;
            } else {
                alert(data.message || 'Failed to fetch users');
            }
        } else {
            alert('Failed to fetch users');
        }

        isLoading = false;
    }

    async function updateUserRole(userId: string, role: string) {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role }),
        });

        if (!response.ok) new Error('Failed to update user role');
        const data = await response.json();
        if (data.success) {
            const updatedUser = users.find(user => user.id === userId);
            if (updatedUser) updatedUser.role = role;
        } else {
            alert('Failed to update user role');
        }

    }

    onMount(() => {
        fetchUsers();
    });
</script>

<main class="admin-users-page">
    <h1>Admin Users</h1>

    {#if isLoading}
        <p>Loading users...</p>
    {:else if users.length === 0}
        <p>No users found.</p>
    {:else}
        <div class="users-table">
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {#each users as user}
                    <tr>
                        <td>{user.name || 'Unknown'}</td>
                        <td>{user.surname || 'Unknown'}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            {#if user.id !== currentUserId}
                                <select
                                        bind:value={user.role}
                                        on:change={(e) => {
                                            if (e.target instanceof HTMLSelectElement) {
                                                updateUserRole(user.id, e.target.value);
                                            }
                                        }}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>

                            {:else}
                                <span>Cannot modify yourself</span>
                            {/if}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {/if}
</main>

<style>
    main {
        max-width: 1000px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .users-table table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2rem;
    }

    th, td {
        padding: 0.75rem 1rem;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background: #fff;
    }

    select:focus {
        outline: 2px solid #007bff;
    }

    span {
        color: gray;
        font-size: 0.9rem;
    }
</style>
