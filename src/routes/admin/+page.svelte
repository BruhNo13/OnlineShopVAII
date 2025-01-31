<script lang="ts">
    import Product from '../../components/Product.svelte';

    // export let products: {
    //     id: string;
    //     name: string;
    //     price: number;
    //     image: string;
    //     type: string;
    //     color?: string;
    //     brand?: string;
    //     sale?: number;
    //     gender?: string;
    // }[];
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
                location.reload(); // Reload stránku na načítanie aktualizovaných produktov
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
            <a
                    class="product-wrapper {selectedItem === product ? 'selected' : ''}"
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && selectItem(product)}
                    onclick={() => selectItem(product)}
                    href="#"
            >
                <Product {product} isAdminPage={true} />
            </a>
        {/each}
    </div>
    <div class="admin-actions">
        <button class="action-button add" onclick={addProduct}>Add</button>
        <button class="action-button edit" onclick={editProduct} disabled={!selectedItem}>Edit</button>
        <button class="action-button delete" onclick={deleteProduct} disabled={!selectedItem}>Delete</button>
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
        text-decoration: none; /* Odstránenie podčiarkovania */
        color: inherit; /* Zachovanie aktuálnej farby textu */
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

