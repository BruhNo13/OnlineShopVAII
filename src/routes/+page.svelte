<script>
    export let data;
</script>

<section class="hero">
    <div class="hero-content">
        <h1>Welcome to FakeShein!</h1>
        <p>Your one-stop shop for clothes and sneakers.</p>
    </div>
</section>

<section class="products">
    <h2>Featured Products</h2>
    <div class="product-grid">
        <!-- Example Product Card -->
        <div class="product-card">
            <img src="/HomePage/image1.png" alt="Product Name" />
            <h3>Product Name</h3>
            <p>$99.99</p>
            <a href="/products/1">View Details</a>
        </div>
        <div class="product-card">
            <img src="/image2.png" alt="Product Name" />
            <h3>Product Name</h3>
            <p>$79.99</p>
            <a href="/products/2">View Details</a>
        </div>
    </div>
</section>

<style>
    /* Hero Section */
    .hero {
        background-image: url('/hero-image.jpg');
        background-size: cover;
        background-position: center;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
    }

    .hero-content {
        background-color: rgba(0, 0, 0, 0.6);
        padding: 1.5rem;
        border-radius: 8px;
    }

    .hero h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .hero p {
        font-size: 1rem;
    }

    /* Products Section */
    .products {
        margin-top: 2rem;
        padding: 0 1rem;
    }

    .products h2 {
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .product-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .product-card img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
    }

    .product-card h3 {
        margin: 1rem 0 0.5rem;
        font-size: 1.2rem;
    }

    .product-card p {
        margin: 0.5rem 0;
        color: #555;
    }

    .product-card a {
        text-decoration: none;
        color: #007bff;
        transition: color 0.3s;
    }

    .product-card a:hover {
        color: #0056b3;
    }
</style>
