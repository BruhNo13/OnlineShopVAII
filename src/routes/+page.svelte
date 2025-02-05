<script lang="ts">
    import Product from "../components/Product.svelte";

    export let data: { products: any[] };

    const products = data.products;
</script>

<section class="hero">
    <div class="hero-content">
        <h1>Welcome to FakeShein!</h1>
        <p>Your one-stop shop for clothes and sneakers.</p>
    </div>
</section>

{#if products && products.length > 0}
    <div class="products-grid">
        {#each products as product (product.id)}
            <Product {product} isFavorite={product.isFavorite} />
        {/each}
    </div>
{:else}
    <div class="no-products">
        <p>No products available.</p>
    </div>
{/if}


<style>
    .hero {
        background-image: url('/HomePage/image3.png');
        background-size: cover;
        background-position: center;
        height: 350px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        position: relative;
    }

    .hero::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8));
        z-index: 0;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 2rem;
        border-radius: 12px;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .hero h1 {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: #ff5722;
    }

    .hero p {
        font-size: 1.2rem;
        line-height: 1.5;
    }

    .products-grid {
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        padding: 2rem;
        background-color: #f9f9f9;
    }

</style>
