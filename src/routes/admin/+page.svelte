<script lang="ts">
    import Product from '../../components/Product.svelte';

    export let data: { products: any[] };

    const products = data.products;
    let selectedItem: typeof products[0] | null = null;

    function addProduct() {
        window.location.href = '/admin/addProduct';
    }

    function editProduct() {
        if (selectedItem) {
            window.location.href = `/admin/editProduct/${selectedItem.id}`;
        }
    }

    async function deleteProduct() {
        if (!selectedItem) {
            alert('No product selected.');
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

            if (result.success) {
                alert('Product deleted successfully.');
                selectedItem = null;
                location.reload();
            } else {
                alert('Failed to delete product. Please try again.');
            }
        } catch (err) {
            console.error('Unexpected error deleting product:', err);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    function selectItem(product: typeof products[0]) {
        selectedItem = selectedItem === product ? null : product;
    }
</script>

<main class="admin-page">
    <div class="products-grid">
        {#each products as product}
            <div
                    class="product-wrapper {selectedItem === product ? 'selected' : ''}"
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && selectItem(product)}
                    onclick={() => selectItem(product)}
            >
                <Product {product} isAdminPage={true} />
            </div>
        {/each}

    </div>
    <div class="admin-actions">
        <button class="action-button add" onclick={addProduct}>Add</button>
        <button class="action-button edit" onclick={editProduct} disabled={!selectedItem}>Edit</button>
        <button class="action-button delete" onclick={deleteProduct} disabled={!selectedItem}>Delete</button>
    </div>

    <div class="admin-side-buttons">
        <button class="side-button orders" onclick={() => window.location.href = '/admin/orders'}>
            Orders
        </button>
        <button class="side-button users" onclick={() => window.location.href = '/admin/users'}>
            Users
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
        text-decoration: none;
        color: inherit;
    }

    .product-wrapper:hover {
        outline: 2px solid #ff5722;
    }

    .admin-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .product-wrapper.selected {
        outline: 2px solid #2196f3;
        box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
        transform: scale(1.05);
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
    .admin-side-buttons {
        position: fixed;
        top: 10rem;
        left: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .side-button {
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        width: 150px;
        text-align: center;
        transition: background-color 0.3s, transform 0.3s;
    }

    .side-button.orders {
        background-color: #ff9800;
        color: white;
    }

    .side-button.orders:hover {
        background-color: #e68900;
    }

    .side-button.users {
        background-color: #3f51b5;
        color: white;
    }

    .side-button.users:hover {
        background-color: #2e3e9e;
    }
</style>

