<script lang="ts">
    import { onMount } from 'svelte';

    let filters = {
        category: '',
        size: [],
        brand: [],
    };

    let products = [];

    async function fetchProducts() {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/products?${query}`);
        const data = await response.json();
        products = data.products;
    }

    onMount(() => {
        fetchProducts();
    });

    function applyFilter(key, value) {
        filters[key] = value;
        fetchProducts();
    }
</script>

<div class="filter-page">
    <aside class="filter-sidebar">
        <h2>Filter</h2>

        <div class="filter-category">
            <h3>Kategória</h3>
            <button on:click={() => applyFilter('category', 'men')}>Men</button>
            <button on:click={() => applyFilter('category', 'women')}>Women</button>
            <button on:click={() => applyFilter('category', 'kids')}>Kids</button>
        </div>

        <div class="filter-size">
            <h3>Veľkosť</h3>
            <label><input type="checkbox" on:change={() => applyFilter('size', 42)} /> 42</label>
            <label><input type="checkbox" on:change={() => applyFilter('size', 43)} /> 43</label>
            <label><input type="checkbox" on:change={() => applyFilter('size', 44)} /> 44</label>
        </div>

        <div class="filter-brand">
            <h3>Značka</h3>
            <label><input type="checkbox" on:change={() => applyFilter('brand', 'Nike')} /> Nike</label>
            <label><input type="checkbox" on:change={() => applyFilter('brand', 'Adidas')} /> Adidas</label>
            <label><input type="checkbox" on:change={() => applyFilter('brand', 'Puma')} /> Puma</label>
        </div>
    </aside>

    <main class="product-list">
        {#each products as product}
            <div class="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.price} €</p>
            </div>
        {/each}
    </main>
</div>

<style>
    .filter-page {
        display: flex;
    }

    .filter-sidebar {
        width: 20%;
        padding: 1rem;
        background-color: #f9f9f9;
        border-right: 1px solid #ddd;
    }

    .filter-sidebar h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .filter-category, .filter-size, .filter-brand {
        margin-bottom: 2rem;
    }

    .filter-category button {
        display: block;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background-color: #fff;
        border: 1px solid #ddd;
        cursor: pointer;
    }

    .filter-category button:hover {
        background-color: #eee;
    }

    .product-list {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1rem;
    }

    .product-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        background-color: #fff;
    }

    .product-card img {
        width: 100%;
        height: auto;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
</style>
