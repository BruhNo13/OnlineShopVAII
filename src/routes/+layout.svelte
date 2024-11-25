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
            <a href="/login" class="nav-right-link">Profile</a>
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
        padding: 0.8rem 1rem;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap; /* Ensures content wraps on small screens */
        padding: 0 0.5rem;
    }

    .nav-left, .nav-right {
        display: flex;
        align-items: center;
    }

    .nav-left {
        gap: 2rem;
    }

    .nav-right {
        gap: 1rem;
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
        flex-wrap: wrap; /* Wrap navigation links on small screens */
        gap: 1rem;
        margin: 0;
        padding: 0;
    }

    .nav-links li {
        position: relative; /* Needed for dropdown positioning */
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

    .dropdown:hover .dropdown-menu {
        display: block; /* Show dropdown on hover */
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

    .search-bar {
        height: 1.0rem;
        width: 260px;
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ddd;
        outline: none;
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

    /* Responsive Styles */
    @media (max-width: 768px) {
        .nav-links {
            flex-direction: column; /* Stack links vertically */
            gap: 0.5rem;
        }

        .navbar {
            flex-direction: column; /* Stack navbar sections vertically */
            align-items: flex-start;
        }

        .search-bar {
            width: 100%; /* Expand search bar width */
        }

        .nav-right {
            flex-wrap: wrap; /* Wrap right-side content */
            justify-content: flex-start;
        }
    }

    @media (max-width: 480px) {
        .logo {
            font-size: 1.2rem;
        }

        .nav-links li a, .nav-right-link {
            font-size: 0.9rem;
        }
    }

    /* Global Link Styling */
    a {
        text-decoration: none; /* Remove underline */
        color: white; /* Set default link color to white */
    }

    /* Specific Styles for Navbar Links */
    .nav-links li a,
    .nav-right-link,
    .dropdown-toggle,
    .dropdown-menu li a {
        color: white; /* Ensure links are white */
        text-decoration: none; /* Remove underline */
    }

    /* Hover Effect for Links */
    .nav-links li a:hover,
    .nav-right-link:hover,
    .dropdown-menu li a:hover {
        color: #aaa; /* Set a light gray color on hover */
    }

</style>
