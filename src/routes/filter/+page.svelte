<script lang="ts">
    import { onMount } from 'svelte';
    import Product from "../../components/Product.svelte";
    import { writable } from "svelte/store";

    let selectedFilters: { [key: string]: any[] } = {};
    let selectedPrice = 0;
    let maxPrice = 0;
    let products = writable<any[]>([]);
    let filterOptions = {
        types: [],
        brands: [],
        colors: [],
        sizes: [],
        sales: ['All products', 'Without sale', 'to 20%', 'from 20%', 'from 40%', 'All sales'],
        categories: ['clothing', 'shoes', 'accessories'],
    };

    function initializeFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const initialGender = urlParams.get('gender');
        const initialCategory = urlParams.get('category');

        if (initialGender) {
            selectedFilters.gender = [initialGender];
        } else {
            selectedFilters.gender = [];
        }

        if (initialCategory) {
            selectedFilters.category = [initialCategory];
        } else {
            selectedFilters.category = [];
        }
    }

    async function fetchFilterOptions() {
        const response = await fetch('/api/filter', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        filterOptions.types = data.types || [];
        filterOptions.brands = data.brands || [];
        filterOptions.colors = data.colors || [];
        filterOptions.sizes = data.sizes || [];
        maxPrice = data.maxPrice || 0;
        selectedPrice = maxPrice;
    }

    async function fetchProducts() {
        selectedFilters.price = [selectedPrice];
        const response = await fetch('/api/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedFilters),
        });

        const data = await response.json();
        if (response.ok) {
            products.set(data.products);
        } else {
            console.error('Error fetching products:', data.message);
        }
    }

    function updateFilter(filterName: string, value: string | number) {
        if (selectedFilters[filterName]?.includes(value)) {
            selectedFilters[filterName] = selectedFilters[filterName].filter((v) => v !== value);
        } else {
            selectedFilters[filterName] = [...(selectedFilters[filterName] || []), value];
        }
        fetchProducts();
    }

    function updatePrice(value: number) {
        selectedPrice = value;
        fetchProducts();
    }

    function togglesale(discount: string) {
        if (selectedFilters.discount?.includes(discount)) {
            selectedFilters.discount = [];
        } else {
            selectedFilters.discount = [discount];
        }
        fetchProducts();
    }

    onMount(() => {
        initializeFilters();
        fetchFilterOptions();
        fetchProducts();
    });
</script>


<main class="filter-page">
    <div class="filters">
        <h2>Filters</h2>

        <div>
            <h3>Price</h3>
            <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="1"
                    bind:value={selectedPrice}
                    on:input={(e) => updatePrice(Number(e.currentTarget.value))}
            />
            <p>Selected price: {selectedPrice} €</p>
        </div>

        <div>
            <h3>Gender</h3>
            <input type="checkbox" id="male" value="male" checked={selectedFilters.gender?.includes('male')} on:change={() => updateFilter('gender', 'male')} />
            <label for="male">Men</label>
            <input type="checkbox" id="female" value="female" checked={selectedFilters.gender?.includes('female')} on:change={() => updateFilter('gender', 'female')} />
            <label for="female">Women</label>
            <input type="checkbox" id="kids" value="other" checked={selectedFilters.gender?.includes('other')} on:change={() => updateFilter('gender', 'other')} />
            <label for="kids">Kids</label>
        </div>

        <div>
            <h3>Category</h3>
            {#each filterOptions.categories as category}
                <div>
                    <input
                            type="checkbox"
                            id={category}
                            value={category}
                            checked={selectedFilters.category?.includes(category)}
                            on:change={() => updateFilter('category', category)}
                    />
                    <label for={category}>{category}</label>
                </div>
            {/each}
        </div>

        <div>
            <h3>Type</h3>
            {#if filterOptions.types.length > 0}
                {#each filterOptions.types as type}
                    <div>
                        <input
                                type="checkbox"
                                id={type}
                                value={type}
                                checked={selectedFilters.type?.includes(type)}
                                on:change={() => updateFilter('type', type)}
                        />
                        <label for={type}>{type}</label>
                    </div>
                {/each}
            {:else}
                <p>No types available</p>
            {/if}
        </div>

        <div>
            <h3>Color</h3>
            {#each filterOptions.colors as color}
                <div>
                    <input
                            type="checkbox"
                            id={color}
                            value={color}
                            checked={selectedFilters.color?.includes(color)}
                            on:change={() => updateFilter('color', color)}
                    />
                    <label for={color}>{color}</label>
                </div>
            {/each}
        </div>

        <div>
            <h3>Brand</h3>
            {#each filterOptions.brands as brand}
                <div>
                    <input
                            type="checkbox"
                            id={brand}
                            value={brand}
                            checked={selectedFilters.brand?.includes(brand)}
                            on:change={() => updateFilter('brand', brand)}
                    />
                    <label for={brand}>{brand}</label>
                </div>
            {/each}
        </div>

        <div>
            <h3>Size</h3>
            {#each filterOptions.sizes as size}
                <div>
                    <input
                            type="checkbox"
                            id={size}
                            value={size}
                            checked={selectedFilters.size?.includes(size)}
                            on:change={() => updateFilter('size', size)}
                    />
                    <label for={size}>{size}</label>
                </div>
            {/each}
        </div>

        <div>
            <h3>Sales</h3>
            {#each filterOptions.sales as sale}
                <div>
                    <input
                            type="radio"
                            id={sale}
                            name="sale"
                            value={sale}
                            checked={selectedFilters.discount?.includes(sale)}
                            on:change={() => togglesale(sale)}
                    />
                    <label for={sale}>{sale}</label>
                </div>
            {/each}
        </div>
    </div>

    <div class="products-grid">
        {#if products && $products.length > 0}
            {#each $products as product (product.id)}
                <Product {product} isFavorite={product.isFavorite} />
            {/each}
        {:else}
            <div class="no-products">
                <p>No products available.</p>
            </div>
        {/if}
    </div>
</main>

<style>
    .filter-page {
        display: flex;
        gap: 2rem;
        padding: 2rem;
    }

    .filters {
        flex: 2;
        max-width: 300px;
    }

    .products-grid {
        flex: 5;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
    }

    @media (max-width: 768px) {
        .filter-page {
            flex-direction: column;
            padding: 1rem;
        }

        .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
    }

    @media (max-width: 480px) {
        .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 1rem;
        }
    }
</style>
