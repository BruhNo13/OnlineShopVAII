<script lang="ts">
    import { onMount } from 'svelte';
    import CartItem from '../../components/CartItem.svelte';

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
        try {
            const response = await fetch('/api/cart', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                Error(errorData.message || 'Failed to fetch cart items.');
            }

            const data = await response.json();
            cartItems = data.cartItems;
        } catch (error: any) {
            console.error('Error fetching cart items:', error.message);
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }

    async function placeOrder() {
        placingOrder = true;
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order.');
            }

            alert('Order placed successfully!');
            cartItems = [];
        } catch (error: any) {
            console.error('Error placing order:', error.message);
            alert('Failed to place order. Please try again.');
        } finally {
            placingOrder = false;
        }
    }

    async function updateCartQuantity(cartItemId: string, quantity: number) {
        try {
            const response = await fetch('/api/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId, quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart quantity.');
            }

            const updatedItem = cartItems.find((item) => item.id === cartItemId);
            if (updatedItem) {
                updatedItem.quantity = quantity;
            }
        } catch (error: any) {
            console.error('Error updating cart quantity:', error.message);
            alert('Failed to update quantity. Please try again.');
        }
    }

    async function removeFromCart(cartItemId: string) {
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart.');
            }

            cartItems = cartItems.filter((item) => item.id !== cartItemId);
        } catch (error: any) {
            console.error('Error removing item from cart:', error.message);
            alert('Failed to remove item from cart.');
        }
    }

    onMount(() => {
        fetchCartItems();
    });
</script>

<main>
    <h1>Your Cart</h1>
    {#if isLoading}
        <p>Loading cart items...</p>
    {:else if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if cartItems.length === 0}
        <p>Your cart is empty.</p>
    {:else}
        <div>
            <div class="cart-grid">
                {#each cartItems as cartItem (cartItem.id)}
                    <CartItem
                            {cartItem}
                            onRemove={(id) => removeFromCart(id)}
                            onUpdateQuantity={(id, quantity) => updateCartQuantity(id, quantity)}
                    />
                {/each}
            </div>
            <p class="total-price">Total Price: {totalPrice.toFixed(2)} €</p>
            <button
                    class="place-order-button"
                    on:click={placeOrder}
                    disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>
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

    .cart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .error {
        color: red;
        font-weight: bold;
        text-align: center;
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

</style>
