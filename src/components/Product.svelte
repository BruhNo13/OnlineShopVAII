<script lang="ts">
    export let product: {
        id: string;
        name: string;
        price: number;
        image: string;
        type: string;
        gender?: string;
        color?: string;
        brand?: string;
        sale?: number;
    };
    export let isAdminPage: boolean = false;
</script>

<div class="product-card">
    {#if !isAdminPage}
        <a href={`/product/${product.id}`}>
            <img src={product.image} alt={product.name} class="product-image" />
        </a>
    {:else}
        <img src={product.image} alt={product.name} class="product-image" />
    {/if}
    <h2 class="product-name">{product.name}</h2>
    <p class="product-price">{product.price.toFixed(2)} €</p>
</div>

<style>
    .product-card {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        transition: transform 0.3s, box-shadow 0.3s;
        background-color: #fff;
        cursor: pointer;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .product-image {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    .product-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
    }

    .product-price {
        font-size: 1rem;
        color: #ff5722;
        font-weight: bold;
        margin-top: 0.5rem;
    }
</style>
