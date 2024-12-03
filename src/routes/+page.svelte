<script lang="ts">
    import Product from "../components/Product.svelte";
    import {supabase} from "$lib/supabase";
    import {onMount} from "svelte";

    interface product {
        id: string;
    }
    let Products: product[] = [];


    async function loadAllProducts() {
        const { data, error } = await supabase
            .from('Products')
            .select('id');

        if (error) {
            console.error('Error loading products:', error.message);
            return;
        }

        Products = data;
        console.log('Products loaded successfully:', Products);
    }

    onMount(() => {
        loadAllProducts();
    })

    export const data: Record<string, any> = {};
    console.log("som na hlavnej stranke");
</script>

<section class="hero">
    <div class="hero-content">
        <h1>Welcome to FakeShein!</h1>
        <p>Your one-stop shop for clothes and sneakers.</p>
    </div>
</section>
<div class="products-grid">
    {#each Products as product}
        <Product id={product.id} />
    {/each}
</div>

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

    .product-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        border-color: #ff5722;
    }

    .product-card img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .product-card h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #333;
    }

    .product-card p {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 1rem;
    }

    .product-card a {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #ff5722;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    .product-card a:hover {
        background-color: #e64a19;
    }

    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        line-height: 1.6;
        background-color: #fff;
        color: #333;
    }

    h1, h2 {
        font-family: 'Roboto', sans-serif;
        margin-bottom: 1rem;
    }

    .products {
        margin-top: 2rem;
    }

    .products h2 {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #ff5722;
    }
</style>

