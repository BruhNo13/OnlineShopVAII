<script lang="ts">
    export let cartItem: {
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
    };

    export let onRemove: (id: string) => void;
    export let onUpdateQuantity: (id: string, quantity: number) => void;

    function decreaseQuantity() {
        if (cartItem.quantity > 1) {
            onUpdateQuantity(cartItem.id, cartItem.quantity - 1);
        }
    }

    function increaseQuantity() {
        onUpdateQuantity(cartItem.id, cartItem.quantity + 1);
    }
</script>

<div class="cart-item">
    <div class="product-details">
        <img src={cartItem.product.image} alt={cartItem.product.name} class="product-image" />
        <div class="product-info">
            <h2>{cartItem.product.name}</h2>
            <p>Type: {cartItem.product.type}</p>
            {#if cartItem.product.color}
                <p>Color: {cartItem.product.color}</p>
            {/if}
            {#if cartItem.product.brand}
                <p>Brand: {cartItem.product.brand}</p>
            {/if}
        </div>
    </div>
    <div class="cart-item-details">
        <div class="quantity-control">
            <button on:click={decreaseQuantity} disabled={cartItem.quantity <= 1}>-</button>
            <span>{cartItem.quantity}</span>
            <button on:click={increaseQuantity}>+</button>
        </div>
        <p>Price per item: {cartItem.price.toFixed(2)} €</p>
        <p>Total: {(cartItem.quantity * cartItem.price).toFixed(2)} €</p>
        <button on:click={() => onRemove(cartItem.id)}>Remove</button>
    </div>
</div>

<style>
    .quantity-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .quantity-control button {
        background-color: #ff5722;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .quantity-control button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .quantity-control span {
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>
