<script>
    export let data;
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
            </ul>
        </div>
        <div class="nav-right">
            <div class="search-container">
                <input type="text" class="search-bar" placeholder="Search..." />
                <button class="search-button">Search</button>
            </div>
            <a href="/profile" class="nav-right-link">Profile</a>
            <a href="/favourites" class="nav-right-link">Favourites</a>
            <a href="/cart" class="nav-right-link">My Cart</a>
        </div>
    </nav>
</header>

<main class="content">
    <slot /> <!-- Render child page content -->
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
        padding: 1.5rem 0;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
    }

    .nav-left {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
        color: white;
    }

    .nav-links {
        list-style: none;
        display: flex;
        gap: 1.5rem;
        margin: 0;
        padding: 0;
    }

    .nav-links li {
        position: relative; /* Needed for dropdown positioning */
    }

    .dropdown-toggle {
        text-decoration: none;
        color: white;
        font-size: 1rem;
        text-transform: uppercase;
        transition: color 0.3s;
    }

    .dropdown-menu {
        display: none; /* Hide dropdown by default */
        position: absolute;
        background-color: black;
        padding: 0.5rem 0;
        top: 100%; /* Position below the parent */
        left: 0;
        list-style: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
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

    .dropdown:hover .dropdown-menu {
        display: block; /* Show dropdown on hover */
    }

    .nav-right-link {
        text-decoration: none;
        color: white;
        font-size: 1rem;
        transition: color 0.3s;
    }

    .search-bar {
        height: 2rem;
        width: 200px;
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ddd;
        outline: none;
        font-size: 0.9rem;
    }

    .search-bar:focus {
        border-color: #555;
    }

    .search-button {
        height: 2rem;
        padding: 0 1rem;
        background-color: #555;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s;
    }

    .search-button:hover {
        background-color: #333;
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
    .nav-links li a, .dropdown-toggle, .nav-right-link {
        color: white;
    }
</style>
