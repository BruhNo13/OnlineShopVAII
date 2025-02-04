<script lang="ts">
    export let item: {
        Product: { name: string; image: string };
        quantity: number;
        price: number;
    };
</script>

<div class="order-item">
    <img src={item.Product.image} alt={item.Product.name} />
    <div class="content">
        <p><strong>{item.Product.name}</strong></p>
        <p>Quantity: {item.quantity}</p>
        <p>Price per unit: {item.price.toFixed(2)} €</p>
        <p>Total: {(item.quantity * item.price).toFixed(2)} €</p>
    </div>
</div>

<style>
    .order-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        max-width: 200px;
        height: auto;
    }

    .order-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .content {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .order-item p {
        margin: 0;
        font-size: 0.9rem;
    }
</style>
