<script lang="ts">
    import { onMount } from 'svelte';

    interface User {
        id: string;
        name: string | null;
        surname: string | null;
        email: string;
    }

    interface Order {
        id: string;
        order_date: string;
        user: User | null;
        total_price: number;
        status: string;
    }

    let orders: Order[] = [];
    let isLoading = true;

    async function fetchOrders() {
        isLoading = true;
        try {
            const response = await fetch('/api/orders/adminOrders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            if (data.success) {
                orders = data.orders;
            } else {
                alert(data.message || 'Failed to fetch orders');
            }
        } catch (err: any) {
            console.error('Error fetching orders:', err.message);
            alert('An error occurred while fetching orders.');
        } finally {
            isLoading = false;
        }
    }

    async function updateOrderStatus(orderId: string, status: string) {
        try {
            const response = await fetch('/api/orders/adminOrders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status }),
            });

            if (!response.ok) throw new Error('Failed to update order status');
            const data = await response.json();
            if (data.success) {
                const updatedOrder = orders.find((order) => order.id === orderId);
                if (updatedOrder) updatedOrder.status = status;
            } else {
                alert('Failed to update order status');
            }
        } catch (err: any) {
            console.error('Error updating order status:', err.message);
        }
    }

    onMount(() => {
        fetchOrders();
    });
</script>

<main class="admin-orders-page">
    <h1>Orders</h1>

    {#if isLoading}
        <p>Loading orders...</p>
    {:else if orders.length === 0}
        <p>No orders found.</p>
    {:else}
        <div class="orders-table">
            <table>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Total Price</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {#each orders as order}
                    <tr>
                        <td>{order.id}</td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>
                            {order.user?.name || 'Unknown'} {order.user?.surname || ''}
                        </td>
                        <td>{order.user?.email || 'Unknown'}</td>
                        <td>{order.total_price.toFixed(2)} €</td>
                        <td>
                            <select
                                    bind:value={order.status}
                                    on:change={(e) => updateOrderStatus(order.id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {/if}
</main>

<style>
    .admin-orders-page {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 1rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2rem;
    }

    th,
    td {
        padding: 0.75rem 1rem;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background: #fff;
    }

    select:focus {
        outline: 2px solid #007bff;
    }
</style>
