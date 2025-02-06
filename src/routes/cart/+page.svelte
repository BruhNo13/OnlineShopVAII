<script lang="ts">
    import { onMount } from 'svelte';

    let cartItems: {
        id: string;
        product_id: string;
        quantity: number;
        price: number;
        size: number;
        product: {
            id: string;
            name: string;
            price: number;
            image: string;
            type: string;
            color?: string;
            brand?: string;
            sale?: number;
            gender?: string;
        };
    }[] = [];
    let isLoading = true;
    let errorMessage = '';
    let placingOrder = false;
    $: totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    async function fetchCartItems() {
        isLoading = true;
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const errorData = await response.json();
            new Error(errorData.message || 'Failed to fetch cart items.');
        }

        const data = await response.json();
        if (data.success) {
            cartItems = data.cartItems || [];
        } else {
            new Error(data.message || 'Unknown error occurred.');
        }
        isLoading = false;
    }

    async function updateCart(productId: string, size: number, quantityChange: number) {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, size, quantity: quantityChange }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
            const item = cartItems.find(
                (item) => item.product.id === productId && item.size === size
            );
            if (item) {
                item.quantity += quantityChange;
                cartItems = [...cartItems];
            }
            updateTotalPrice();
        }

    }


    function updateTotalPrice() {
        totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    }

    async function removeFromCart(cartItemId: string) {
        const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId }),
        });

        if (!response.ok) {
            new Error('Failed to remove item from cart.');
        }
        cartItems = cartItems.filter((item) => item.id !== cartItemId);
    }

    async function placeOrder() {
        placingOrder = true;

        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            new Error(errorData.message || 'Failed to place order.');
        }

        alert('Order placed successfully!');
        cartItems = [];

        placingOrder = false;
    }

    onMount(() => {
        fetchCartItems();
    });
</script>

<main>
    <h1>Your Cart</h1>
    {#if isLoading}
        <p>Loading cart items...</p>
    {:else if cartItems.length === 0}
        <p>Your cart is empty.</p>
    {:else}
        <div class="cart-items">
            {#each cartItems as cartItem}
                <div class="cart-item-row">
                    <img src={cartItem.product.image} alt={cartItem.product.name} class="product-image" />
                    <div class="product-details">
                        <h2>{cartItem.product.name}</h2>
                        <p>Type: {cartItem.product.type}</p>
                        <p>Color: {cartItem.product.color || 'N/A'}</p>
                        <p>Brand: {cartItem.product.brand || 'N/A'}</p>
                        <p>Price per item: {cartItem.product.price.toFixed(2)} €</p>
                        <p>Total: {(cartItem.quantity * cartItem.product.price).toFixed(2)} €</p>
                    </div>
                    <div class="quantity-controls">
                        <button
                                on:click={() => updateCart(cartItem.product.id, cartItem.size, -1)}
                                disabled={cartItem.quantity <= 1}>
                            -
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button
                                on:click={() => updateCart(cartItem.product.id, cartItem.size, 1)}>
                            +
                        </button>
                    </div>
                    <button
                            class="remove-button"
                            on:click={() => removeFromCart(cartItem.id)}>
                        Remove
                    </button>
                </div>
            {/each}
        </div>
        <p class="total-price">Total Price: {totalPrice.toFixed(2)} €</p>
        <button
                class="place-order-button"
                on:click={placeOrder}
                disabled={placingOrder}>
            {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
    {/if}
</main>



<style>
    main {
        max-width: 800px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .cart-item-row {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #ddd;
    }

    .product-image {
        width: 100px;
        height: auto;
        border-radius: 8px;
    }

    .product-details h2 {
        margin: 0;
        font-size: 1.2rem;
    }

    .product-details p {
        margin: 0.3rem 0;
        font-size: 0.9rem;
        color: #555;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .quantity-controls button {
        background-color: #ff5722;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 1rem;
    }

    .quantity-controls button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .quantity-controls span {
        font-size: 1rem;
        font-weight: bold;
    }

    .remove-button {
        background-color: #e53935;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 1rem;
    }

    .remove-button:hover {
        background-color: #d32f2f;
    }

    .total-price {
        text-align: right;
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 1rem;
        color: #ff5722;
    }

    .place-order-button {
        display: block;
        margin: 1rem auto;
        padding: 1rem 2rem;
        background-color: #4caf50;
        color: white;
        font-size: 1.2rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .place-order-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .place-order-button:hover:not(:disabled) {
        background-color: #45a049;
    }

    /* Responzivita */
    @media (max-width: 768px) {
        main {
            padding: 1rem;
        }

        .cart-item-row {
            grid-template-columns: auto 1fr;
            gap: 0.5rem;
        }
    }

    @media (max-width: 480px) {
        .cart-item-row {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .quantity-controls {
            justify-content: center;
        }
    }
</style>
