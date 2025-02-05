<script lang="ts">
    import { onMount } from 'svelte';
    import OrderItem from '../../../components/OrderItem.svelte';

    let orders: {
        id: string;
        status: string;
        total_price: number;
        order_date: string;
        Order_Items: {
            product_id: string;
            quantity: number;
            price: number;
            size: number;
            Product: { name: string; image: string };
        }[];
    }[] = [];
    let isLoading = true;
    let errorMessage = '';

    async function fetchOrders() {
        isLoading = true;

        const response = await fetch('/api/orders/userOrders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            new Error(errorData.message || 'Failed to fetch orders.');
        }

        const data = await response.json();
        orders = data.orders;

        isLoading = false;
    }

    async function cancelOrder(orderId: string) {
        const confirmCancel = confirm('Are you sure you want to cancel this order? This action cannot be undone.');
        if (!confirmCancel) return;

        const response = await fetch('/api/orders/userOrders', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to cancel order.');
        }

        alert('Order canceled successfully.');
        orders = orders.map((order) =>
            order.id === orderId ? { ...order, status: 'canceled' } : order
        );
    }

    onMount(() => {
        fetchOrders();
    });
</script>

<main>
    <h1>Your Orders</h1>
    {#if isLoading}
        <p>Loading orders...</p>
    {:else if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if orders.length === 0}
        <p>You have no orders.</p>
    {:else}
        <ul class="orders-list">
            {#each orders as order}
                <li class="order-item">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Price:</strong> {order.total_price.toFixed(2)} €</p>
                    <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                    <div class="products-grid">
                        {#each order.Order_Items as item}
                            <OrderItem {item} />
                        {/each}
                    </div>
                    {#if order.status !== 'canceled' && order.status !== 'completed'}
                        <button class="cancel-button" on:click={() => cancelOrder(order.id)}>Cancel Order</button>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</main>

<style>
    main {
        max-width: 1000px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .orders-list {
        list-style: none;
        padding: 0;
    }

    .order-item {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .cancel-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .cancel-button:hover {
        background-color: #d32f2f;
    }

    .error {
        color: red;
        text-align: center;
        font-weight: bold;
    }
</style>

