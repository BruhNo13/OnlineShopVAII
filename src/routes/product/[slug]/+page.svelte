<script lang="ts">
    import { page } from '$app/stores';

    export let ProductData = $page.data;

    const product = ProductData.product;
    const reviews = product.reviews || [];

    let selectedSize: number | null = null;
    let quantity = 1;
    let newReview: { rating: number; comment: string } = { rating: 0, comment: '' };

    let isSubmitting = false;

    async function addToCart() {
        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }

        const response = await fetch('/api/cart/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: product.id,
                size: selectedSize,
                quantity,
            }),
        });

        const result = await response.json();
        if (result.success) {
            alert(`Product ${product.name} in size ${selectedSize} has been added to your cart.`);
        } else {
            alert('Failed to add product to cart.');
        }
    }

    async function addToFavorites() {

        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.id }),
        });

        if (response.ok) {
            alert(`Product ${product.name} has been added to favorites.`);
        } else {
            alert('Failed to add product to favorites.');
        }

    }

    async function addReview() {
        if (newReview.rating < 0 || newReview.rating > 5) {
            alert('Please provide a valid rating (0-5) and comment.');
            return;
        }

        isSubmitting = true;

        const response = await fetch(`/api/products/${product.id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReview),
        });

        if (!response.ok) {
            throw new Error('Failed to add review.');
        }

        const createdReview = await response.json();
        reviews.unshift(createdReview);
        newReview = { rating: 0, comment: '' };

        isSubmitting = false;

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
                <p class="product-price">{product.price.toFixed(2)} €</p>
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

            <div class="button-group">
                <button class="add-to-cart" on:click={addToCart} disabled={!selectedSize}>
                    Add to Cart
                </button>
                <button class="add-to-favorites" on:click={addToFavorites}>
                    Add to Favorites
                </button>
            </div>
        </div>
    </div>

    <div class="reviews-section">
        <h2>Reviews</h2>
        <div class="add-review">
            <h3>Add a Review</h3>
            <form on:submit|preventDefault={addReview}>
                <label>
                    Rating:
                    <input type="number" min="0" max="5" step="1" bind:value={newReview.rating} />
                </label>
                <label>
                    Comment:
                    <textarea bind:value={newReview.comment} rows="3"></textarea>
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>

        <div class="reviews-list">
            {#each reviews as review}
                <div class="review-card">
                    <p>
                        <strong>{review.user_name || 'Anonymous'}</strong> -
                        {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <p>Rating: <strong>{review.rating}/5</strong></p>
                    <p>{review.comment}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .reviews-section {
        margin-top: 2rem;
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .reviews-section h2 {
        margin-bottom: 1rem;
        color: #333;
        font-size: 1.5rem;
        text-align: center;
    }


    .reviews-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }


    .add-review {
        margin-top: 2rem;
    }

    .add-review h3 {
        font-size: 1.2rem;
        color: #333;
        margin-bottom: 1rem;
    }

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

    .attributes p {
        font-size: 1rem;
        margin: 0.5rem 0;
        color: #555;
    }

    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .add-to-cart,
    .add-to-favorites {
        display: block;
        flex: 1;
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

    .add-to-cart:hover,
    .add-to-favorites:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    .add-to-favorites {
        background-color: #ff4081;
    }

    .add-to-favorites:hover {
        background-color: #c60055;
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

    .reviews-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .review-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .review-card p {
        margin: 0.5rem 0;
    }

    .review-card strong {
        font-weight: bold;
        color: #333;
    }

    .review-card {
        font-size: 1.1rem;
        color: #ff5722;
    }

    .review-card {
        color: #555;
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

        .add-to-cart,
        .add-to-favorites {
            font-size: 1rem;
        }
    }
</style>
