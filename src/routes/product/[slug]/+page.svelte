<script lang="ts">
    import { page } from '$app/stores';

    // type Product = {
    //     id: string;
    //     name: string;
    //     price: number;
    //     image: string;
    //     type: string;
    //     sizes: { size: number; quantity: number }[];
    //     color: string;
    //     brand: string;
    //     sale: number;
    //     gender: string;
    // };

    export let ProductData = $page.data;

    const product = ProductData.product;

    let selectedSize: number | null = null;

    function addToCart() {
        if (!selectedSize) {
            alert('Prosím, vyberte veľkosť.');
            return;
        }

        alert(`Produkt ${product.name} vo veľkosti ${selectedSize} bol pridaný do košíka.`);
    }
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
                    <p class="product-sale">Sale: -{product.sale}%</p>
                {/if}
            </div>

            <div class="attributes">
                <label for="size-select"><strong>Size:</strong></label>
                <select id="size-select" bind:value={selectedSize}>
                    <option value="" disabled selected>Choose size...</option>
                    {#each product.sizes as size}
                        <option value={size.size}>{size.size}</option>
                    {/each}
                </select>

                <p><strong>Color:</strong> {product.color}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
            </div>

            <button class="add-to-cart" on:click={addToCart} disabled={!selectedSize}>
                Add to cart
            </button>
        </div>
    </div>
</div>

<style>
    .product-page {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background-color: #f9f9f9;
    }

    .product-content {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        width: 100%;
        max-width: 1200px;
        padding: 2rem;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 12px;
        overflow: hidden;
    }

    .product-images {
        flex: 1 1 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ececec;
        border-radius: 12px;
        height: 400px;
        overflow: hidden;
    }

    .product-images img {
        max-width: 100%;
        height: auto;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .product-images img:hover {
        transform: scale(1.1);
    }

    .product-details {
        flex: 1 1 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
    }

    .product-name {
        font-size: 2.5rem;
        font-weight: bold;
        color: #333;
    }

    .product-type {
        font-size: 1.2rem;
        color: #777;
        margin-bottom: 1rem;
    }

    .price-section {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1rem;
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
        background: #ffe5e5;
        padding: 0.3rem 0.6rem;
        border-radius: 8px;
    }

    .attributes p {
        font-size: 1rem;
        margin: 0.5rem 0;
        color: #555;
    }

    .add-to-cart {
        display: block;
        width: 100%;
        background-color: #007bff;
        color: white;
        padding: 0.8rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        text-align: center;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .add-to-cart:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    select {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fff;
        transition: border-color 0.3s ease;
    }

    select:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    @media (max-width: 768px) {
        .product-content {
            flex-direction: column;
        }

        .product-images {
            height: auto;
        }

        .product-details {
            padding: 0;
        }

        .add-to-cart {
            font-size: 1rem;
        }
    }
</style>

