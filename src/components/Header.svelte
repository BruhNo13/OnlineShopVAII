<script lang="ts">
    import {goto} from "$app/navigation";

    export let userDetails: { user: string | null; role: string | null };

    let userName = userDetails.user;
    let role = userDetails.role;

    async function logOut() {
        const confirmLogOut = window.confirm('Are you sure you want to log out?');
        if (confirmLogOut) {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                userName = null;
                role = null;
                await goto('/');
                window.location.reload();
            } else {
                console.error('Failed to log out.');
            }
        }
    }
</script>

<header class="header">
    <nav class="navbar">
        <div class="nav-left">
            <a href="/" class="logo">FakeFoot</a>
            <ul class="nav-links">
                <li class="dropdown">
                    <a href="/filter?gender=male" class="dropdown-toggle">MEN</a>
                    <ul class="dropdown-menu">
                        <li><a href="/filter?gender=male&category=clothing">Clothing</a></li>
                        <li><a href="/filter?gender=male&category=shoes">Shoes</a></li>
                        <li><a href="/filter?gender=male&category=accessories">Accessories</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="/filter?gender=female" class="dropdown-toggle">WOMEN</a>
                    <ul class="dropdown-menu">
                        <li><a href="/filter?gender=female&category=clothing">Clothing</a></li>
                        <li><a href="/filter?gender=female&category=shoes">Shoes</a></li>
                        <li><a href="/filter?gender=female&category=accessories">Accessories</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="/filter?gender=other" class="dropdown-toggle">KIDS</a>
                    <ul class="dropdown-menu">
                        <li><a href="/filter?gender=other&category=clothing">Clothing</a></li>
                        <li><a href="/filter?gender=other&category=shoes">Shoes</a></li>
                        <li><a href="/filter?gender=other&category=accessories">Accessories</a></li>
                    </ul>
                </li>

                <li><a href="/filter?category=shoes">SHOES</a></li>
                <li><a href="/filter?category=clothing">CLOTHING</a></li>
                <li><a href="/filter?category=accessories">ACCESSORIES</a></li>
            </ul>
        </div>

        <div class="nav-right">
            <div class="search-container">
                <input type="text" class="search-bar" placeholder="Search..." />
                <button class="search-button">Search</button>
            </div>
            {#if userName}
                <div class="user-container">
                    {#if role === 'admin' || role === 'manager'}
                        <a href="/admin" class="admin-link">ADMIN</a>
                    {/if}
                    <a href="/profile" class="nav-right-link">{userName}</a>
                    <button on:click={logOut} class="nav-right-link">Log out</button>
                </div>
            {:else}
                <a href="/login" class="nav-right-link">Log in</a>
            {/if}
            <a href="/favorites" class="nav-right-link">Favourites</a>
            <a href="/cart" class="nav-right-link">My Cart</a>
        </div>
    </nav>
</header>

<style>
    .header {
        background-color: black;
        color: white;
        padding: 1rem;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav-left {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .logo {
        font-size: 1.8rem;
        font-weight: bold;
        text-decoration: none;
        color: white;
        margin-right: 2rem;
    }

    .nav-links {
        list-style: none;
        display: flex;
        gap: 1rem;
        margin: 0;
        padding: 0;
    }

    .nav-links li {
        position: relative;
    }

    .nav-links a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        transition: background-color 0.3s;
    }

    .nav-links a:hover {
        background-color: #333;
    }

    .dropdown-menu {
        display: none;
        position: absolute;
        background-color: black;
        padding: 0.5rem 0;
        top: 100%;
        left: 0;
        list-style: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }

    .dropdown:hover .dropdown-menu {
        display: block;
    }

    .dropdown-menu li a {
        display: block;
        text-decoration: none;
        color: white;
        padding: 0.5rem 1rem;
        transition: background-color 0.3s;
    }

    .dropdown-menu li a:hover {
        background-color: #555;
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .search-bar {
        width: 200px;
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .search-button {
        background-color: #ff5722;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .search-button:hover {
        background-color: #e64a19;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .nav-right-link {
        color: white;
        text-decoration: none;
        font-size: 0.9rem;
    }

    .nav-right-link:hover {
        text-decoration: underline;
    }

    .user-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .admin-link {
        font-weight: bold;
        color: #ff5722;
        text-decoration: none;
    }

    .admin-link:hover {
        text-decoration: underline;
    }
</style>
