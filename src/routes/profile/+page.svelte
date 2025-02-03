<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    // ✅ Načítanie používateľských údajov priamo zo serverom predpripravených dát
    $: user = $page.data.user;
    $: surname = $page.data.surname;
    $: email = $page.data.email;
    $: gender = $page.data.gender;
    $: role = $page.data.role;

    // ✅ Tieto údaje nevieme načítať zo `+layout.server.ts`, takže ich musíme získať asynchrónne
    let favoritesCount = 0;
    let cartCount = 0;
    let ordersCount = 0;
    let reviewsCount = 0;

    async function fetchProfileStats() {
        try {
            const response = await fetch('/api/profile/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile statistics');
            }

            const data = await response.json();
            favoritesCount = data.favoritesCount || 0;
            cartCount = data.cartCount || 0;
            ordersCount = data.ordersCount || 0;
            reviewsCount = data.reviewsCount || 0;
        } catch (error: any) {
            console.error('Error fetching profile statistics:', error.message);
        }
    }

    // ✅ Spustíme len dotaz na štatistiky, lebo ostatné údaje už máme
    onMount(() => {
        fetchProfileStats();
    });
</script>

<main>
    <h1>Your Profile</h1>
    {#if user}
        <section>
            <h2>{user} {surname}</h2>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Gender:</strong> {gender || 'Not specified'}</p>
            <p><strong>Role:</strong> {role}</p>
        </section>
        <section>
            <h2>Overview</h2>
            <ul>
                <li><a href="/favorites">Favorites: {favoritesCount} products</a></li>
                <li><a href="/cart">Cart: {cartCount} products</a></li>
                <li><a href="/orders">Orders: {ordersCount} active</a></li>
                <li><a href="/reviews">Reviews: {reviewsCount} written</a></li>
            </ul>
        </section>
    {:else}
        <p>You are not logged in. Please <a href="/login">log in</a>.</p>
    {/if}
</main>

<style>
    main {
        max-width: 800px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
    }

    h1, h2 {
        color: #333;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 0.5rem;
    }

    a {
        color: #007BFF;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
