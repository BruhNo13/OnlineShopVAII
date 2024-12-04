<script lang="ts">
    import {supabase} from "$lib/supabase";
    import {onMount} from "svelte";

    export let id: string;

    let product: { name: string; price: number; image: string } = {
        name: '',
        price: 0,
        image: '',
    }

    let imagePath = '';
    async function loadProductDetails() {
        const { data, error } = await supabase.from('Products')
            .select('name, price, image')
            .eq('id', id)
            .single();

            if (!error) {
                if (data.image) {
                    const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.image);
                    imagePath= publicData.publicUrl;
                }

                product = {
                    name: data.name,
                    image: imagePath,
                    price: data.price,
                };
            }
    }

    onMount(() => {
        loadProductDetails();
    })


</script>

<div class="product-card">
    <div class="image-container">
        <img src={product.image} alt={product.name} class="product-image" />
        <button class="wishlist-button" aria-label="Add to wishlist">
            ❤️
        </button>
    </div>
    <div class="product-info">
        <h3 class="product-name">{product.name}</h3>
        <p class="product-price">${product.price.toFixed(2)}</p>
    </div>
</div>

<style>

    .product-card {
        margin: 0px;
        width: 260px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .image-container {
        position: relative;
        width: 100%;
        height: 180px;
        overflow: hidden;
        background-color: #f9f9f9;
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .image-container:hover .product-image {
        transform: scale(1.05);
    }

    .wishlist-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        padding: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .wishlist-button:hover {
        background: #ff4d4d;
        color: white;
        transform: scale(1.1);
    }

    .product-info {
        padding: 15px;
        text-align: center;
    }

    .product-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 10px 0;
        text-transform: capitalize;
    }

    .product-price {
        font-size: 16px;
        color: #ff5722;
        margin: 5px 0;
        font-weight: 700;
    }

    @media (max-width: 768px) {
        .product-card {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
        }

        .wishlist-button {
            top: 8px;
            right: 8px;
        }
    }
</style>
