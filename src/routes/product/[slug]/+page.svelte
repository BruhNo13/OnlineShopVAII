<script lang="ts">
    import { page } from '$app/stores';

    let { product }: { product: App.Product } = $page.data;
</script>

<svelte:head>
    <title>{product.name}</title>
</svelte:head>

<div class="product-page">
    <div class="product-content">
        <div class="product-images">
            <img src={product.image} alt={product.name} class="main-image" />
        </div>

        <div class="product-details">
            <h1 class="product-name">{product.name}</h1>
            <p class="product-type">{product.type}</p>

            <div class="price-section">
                <p class="product-price">{product.price.toFixed(2)} &euro;</p>
                {#if product.sale > 0}
                    <p class="product-sale">Zľava: -{product.sale}%</p>
                {/if}
            </div>

            <div class="attributes">
                <p><strong>Veľkosť:</strong> {product.size}</p>
                <p><strong>Farba:</strong> {product.color}</p>
                <p><strong>Značka:</strong> {product.brand}</p>
            </div>

            <button class="add-to-cart">Pridať do košíka</button>
        </div>
    </div>
</div>

<style>
    html, body {
        height: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
        font-family: Arial, sans-serif;
    }

    .product-page {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
    }

    .product-content {
        display: flex;
        width: 100%;
        max-width: 1200px;
        gap: 2rem;
        background: #fff;
        padding: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    .product-images {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f9f9f9;
        border-radius: 8px;
        height: 500px;
    }

    .product-images img {
        max-width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }

    .product-images img:hover {
        transform: scale(1.05);
    }

    .product-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1rem;
    }

    .product-name {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .product-type {
        font-size: 1.2rem;
        color: #777;
        margin-bottom: 1rem;
    }

    .price-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .product-price {
        font-size: 2rem;
        font-weight: bold;
        color: #ff5722;
    }

    .product-sale {
        font-size: 1.2rem;
        color: #e64a19;
        font-weight: bold;
    }

    .attributes p {
        font-size: 1rem;
        margin: 0.5rem 0;
        color: #555;
    }

    .add-to-cart {
        display: block;
        width: 100%;
        background-color: black;
        color: white;
        padding: 1rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-align: center;
    }

    .add-to-cart:hover {
        background-color: #333;
    }

    @media (max-width: 768px) {
        .product-content {
            flex-direction: column;
        }

        .product-images {
            height: auto;
        }

        .product-details {
            flex: 1;
        }
    }
</style>
