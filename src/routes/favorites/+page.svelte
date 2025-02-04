<script lang="ts">
    import { onMount } from 'svelte';
    import Product from '../../components/Product.svelte';

    type ProductData = {
        id: string;
        name: string;
        price: number;
        image: string;
        type: string;
        brand?: string;
        sale?: number;
    };

    let favoriteProducts: ProductData[] = [];
    let isLoading = true;
    let errorMessage = '';

    async function fetchFavorites() {
        isLoading = true;
        try {
            const response = await fetch('/api/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch favorites');
            }

            const { favorites } = await response.json();

            const productDetails = await Promise.all(
                favorites.map(async (productId: any) => {
                    const response = await fetch(`/api/products/${productId}`);
                    if (response.ok) {
                        return await response.json();
                    } else {
                        console.error(`Failed to fetch details for product ID: ${productId}`);
                        return null;
                    }
                })
            );

            favoriteProducts = productDetails.filter((product) => product !== null);
        } catch (error: any) {
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }

    onMount(fetchFavorites);
</script>

<main class="favorites-page">
    <h1>Favorite Products</h1>
    {#if isLoading}
        <p>Loading favorite products...</p>
    {:else if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if favoriteProducts.length === 0}
        <p>You don't have any favorite products yet.</p>
    {:else}
        <div class="products-grid">
            {#each favoriteProducts as product (product.id)}
                <Product {product} isFavorite={true} />
            {/each}
        </div>
    {/if}
</main>

<style>
    .favorites-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 2rem;
    }

    .error {
        color: red;
        text-align: center;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }
</style>
