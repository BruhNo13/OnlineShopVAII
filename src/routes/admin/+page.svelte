<script lang="ts">
    import { onMount } from "svelte";
    import Product from "../../components/Product.svelte";

    interface ProductData {
        id: string;
        name: string;
        price: number;
        image: string;
    }

    let products: ProductData[] = [];
    let selectedItem: ProductData | null = null;

    onMount(() => {
        fetchProducts();
    });

    async function fetchProducts() {
        try {
            const response = await fetch('/api/products', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success) {
                products = result.products;
            } else {
                console.error('Error fetching products:', result.message);
            }
        } catch (err) {
            console.error('Unexpected error fetching products:', err);
        }
    }

    function addProduct() {
        window.location.href = "/admin/addProduct";
    }

    function editProduct() {
        if (selectedItem) {
            window.location.href = `/admin/editProduct/${selectedItem.id}`;
        }
    }

    async function deleteProduct() {
        if (!selectedItem) {
            alert("No product selected.");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete the product "${selectedItem.name}"?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedItem.id }),
            });

            const result = await response.json();

            if (!result.success) {
                alert('Failed to delete product. Please try again.');
                return;
            }

            products = products.filter(product => selectedItem && product.id !== selectedItem.id);
            selectedItem = null;

            alert('Product deleted successfully.');
        } catch (err) {
            console.error('Unexpected error deleting product:', err);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    function selectItem(product: ProductData) {
        selectedItem = selectedItem === product ? null : product;
    }
</script>

<main class="admin-page">
    <div class="products-grid">
        {#each products as product}
            <div class="product-wrapper {selectedItem === product ? 'selected' : ''}" onclick={() => selectItem(product)}>
                <Product id={product.id} />
            </div>
        {/each}
    </div>
    <div class="admin-actions">
        <button class="action-button add" onclick={addProduct}>Add</button>
        <button
                class="action-button edit"
                onclick={editProduct}
                disabled={!selectedItem}
        >
            Edit
        </button>
        <button
                class="action-button delete"
                onclick={deleteProduct}
                disabled={!selectedItem}
        >
            Delete
        </button>
    </div>
</main>

<style>
    .admin-page {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 1rem;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.5rem;
    }

    .product-wrapper {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
    }

    .product-wrapper.selected {
        outline: 2px solid #ff5722;
    }

    .admin-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .action-button {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
    }

    .action-button.add {
        background-color: #4caf50;
        color: white;
    }

    .action-button.add:hover {
        background-color: #45a049;
    }

    .action-button.edit {
        background-color: #2196f3;
        color: white;
    }

    .action-button.edit:hover {
        background-color: #1976d2;
    }

    .action-button.delete {
        background-color: #f44336;
        color: white;
    }

    .action-button.delete:hover {
        background-color: #d32f2f;
    }

    .action-button:disabled {
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
    }
</style>
