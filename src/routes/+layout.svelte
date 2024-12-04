<script lang="ts">
    export let data: { user: string | null; role: string | null };

    let userName: string | null = data.user;
    let role: string | null = data.role;

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
                    <a href="/men" class="dropdown-toggle">MEN</a>
                    <ul class="dropdown-menu">
                        <li><a href="/men/t-shirts">T-shirts</a></li>
                        <li><a href="/men/hoodies">Hoodies</a></li>
                        <li><a href="/men/jackets-and-coats">Jackets and Coats</a></li>
                        <li><a href="/men/pants">Pants</a></li>
                        <li><a href="/men/shoes">Shoes</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="/women" class="dropdown-toggle">WOMEN</a>
                    <ul class="dropdown-menu">
                        <li><a href="/women/t-shirts">T-shirts</a></li>
                        <li><a href="/women/hoodies">Hoodies</a></li>
                        <li><a href="/women/jackets-and-coats">Jackets and Coats</a></li>
                        <li><a href="/women/pants">Pants</a></li>
                        <li><a href="/women/shoes">Shoes</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="/kids" class="dropdown-toggle">KIDS</a>
                    <ul class="dropdown-menu">
                        <li><a href="/kids/t-shirts">T-shirts</a></li>
                        <li><a href="/kids/hoodies">Hoodies</a></li>
                        <li><a href="/kids/jackets-and-coats">Jackets and Coats</a></li>
                        <li><a href="/kids/pants">Pants</a></li>
                        <li><a href="/kids/shoes">Shoes</a></li>
                    </ul>
                </li>
                <li><a href="/shoes">SHOES</a></li>
                <li><a href="/clothing">CLOTHING</a></li>
                <li><a href="/accessories">ACCESSORIES</a></li>
                <li><a href="/brands">BRANDS</a></li>
                <li><a href="/sales">SALES</a></li>
                {#if role === 'admin'}
                    <li><a href="/admin">ADMIN</a></li>
                {/if}
            </ul>
        </div>
        <div class="nav-right">
            <div class="search-container">
                <input type="text" class="search-bar" placeholder="Search..." />
                <button class="search-button">Search</button>
            </div>
            {#if userName}
                <div class="dropdown">
                    <span class="nav-right-link">{userName}</span>
                    <button on:click={logOut}>Log out</button>
                </div>
            {:else}
                <a href="/login" class="nav-right-link">Log in</a>
            {/if}
            <a href="/favourites" class="nav-right-link">Favourites</a>
            <a href="/cart" class="nav-right-link">My Cart</a>
        </div>
    </nav>
</header>

<main class="content">
    <slot />
</main>

<footer class="footer">
    <p>&copy; 2024 FakeFoot. All rights reserved.</p>
</footer>

<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
    }

    .header {
        background-color: black;
        color: white;
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    .nav-left {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .logo {
        font-size: 1.8rem;
        font-weight: bold;
        text-decoration: none;
        color: white;
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

    a {
        color: white;
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
        background-color: #333;
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .search-bar {
        height: 2rem;
        width: 250px;
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ddd;
        outline: none;
    }

    .search-button {
        height: 2rem;
        padding: 0 1rem;
        background-color: #ff5722;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s;
    }

    .search-button:hover {
        background-color: #e64a19;
    }

    .content {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .footer {
        background-color: black;
        color: white;
        text-align: center;
        padding: 1rem 0;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .nav-links {
            flex-direction: column;
            gap: 0.5rem;
        }

        .search-bar {
            width: 100%;
        }

        .nav-right {
            flex-wrap: wrap;
        }
    }

    @media (max-width: 480px) {
        .logo {
            font-size: 1.5rem;
        }

        .nav-links li a,
        .nav-right-link {
            font-size: 0.9rem;
        }

        .nav-links {
            gap: 0.3rem;
        }
    }
</style>

