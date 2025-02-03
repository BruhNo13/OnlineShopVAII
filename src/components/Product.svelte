<script lang="ts">
    import { goto } from '$app/navigation';

    export let product: {
        id: string;
        name: string;
        price: number;
        image: string;
        type: string;
        color?: string;
        brand?: string;
        sale?: number;
    };
    export let isFavorite: boolean;

    async function toggleFavorite() {
        try {
            const response = await fetch(`/api/favorites`, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: product.id }),
            });

            const result = await response.json();
            if (result.success) {
                isFavorite = !isFavorite;
            } else {
                alert('Nepodarilo sa aktualizovať obľúbené produkty. Skúste znova.');
            }
        } catch (error) {
            console.error('Chyba pri aktualizácii obľúbených produktov:', error);
        }
    }
</script>

<div class="product-card">
    <button class="favorite-button" on:click={toggleFavorite}>
        {#if isFavorite}
            ❤️
        {:else}
            🤍
        {/if}
    </button>

    <a href={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} class="product-image" />
    </a>

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
        justify-content: space-between;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        transition: transform 0.3s, box-shadow 0.3s;
        background-color: #fff;
        cursor: pointer;
        position: relative;
        width: 200px;
        height: 300px;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .product-image {
        width: 100%;
        height: 150px;
        object-fit: contain;
        margin-bottom: 0.5rem;
    }

    .product-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        text-align: center;
        margin: 0.5rem 0;
    }

    .product-price {
        font-size: 1rem;
        color: #ff5722;
        font-weight: bold;
        margin-top: auto;
    }

    .favorite-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        transition: transform 0.2s;
    }

    .favorite-button:hover {
        transform: scale(1.1);
    }

    .favorite-button:focus {
        outline: none;
    }

</style>
