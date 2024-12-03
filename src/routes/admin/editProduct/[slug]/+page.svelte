<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { PageData } from "./$types";

    let { productId } = $page.data as { productId: string };
    console.log(productId);
    let product = {
        name: "",
        price: 0,
        image: "",
        type: "tshirt",
        size: 0,
        color: "red",
        brand: "adidas",
        sale: 0,
        gender: "male",
    };

    let dragOver = false;
    let uploadingImage = false;

    onMount(async () => {
        try {
            if (!productId) {
                throw new Error("Product ID is missing.");
            }

            const { data, error } = await supabase
                .from("Products")
                .select("*")
                .eq("id", productId)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            if (data) {
                product = {
                    name: data.name || "",
                    price: data.price || 0,
                    image: data.image || "",
                    type: data.type || "tshirt",
                    size: data.size || 0,
                    color: data.color || "red",
                    brand: data.brand || "adidas",
                    sale: data.sale || 0,
                    gender: data.gender || "male",
                };
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                alert("Could not load product details. Redirecting...");
            } else {
                console.error("An unknown error occurred:", err);
                alert("An unknown error occurred. Redirecting...");
            }
            goto("/admin");
        }
    });

    async function handleImageUpload(event: DragEvent | Event) {
        uploadingImage = true;
        let file: File | null = null;

        if (event instanceof DragEvent && event.dataTransfer?.files) {
            file = event.dataTransfer.files[0];
        } else if (event.target instanceof HTMLInputElement && event.target.files) {
            file = event.target.files[0];
        }

        if (!file) {
            alert("Please select a valid file.");
            uploadingImage = false;
            return;
        }

        const filePath = `products/${file.name}`;

        const { data: existingFile, error: listError } = await supabase.storage
            .from("images")
            .list("products", { search: file.name });

        if (listError) {
            console.error("Error checking existing file:", listError.message);
            alert("Failed to verify if the file already exists.");
            uploadingImage = false;
            return;
        }

        if (existingFile && existingFile.length > 0) {
            product.image = filePath;
            alert("File already exists. Using the existing file.");
            uploadingImage = false;
            return;
        }

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
            console.error("Error uploading file:", uploadError.message);
            alert("Failed to upload image. Please try again.");
        } else {
            product.image = filePath;
            alert("Image uploaded successfully!");
        }

        uploadingImage = false;
    }

    async function updateProduct() {
        try {
            if (!productId) {
                throw new Error("Product ID is missing.");
            }

            if (!product.name || product.price < 0 || product.sale < 0 || product.sale > 100) {
                alert("Please fill in all required fields and ensure values are valid.");
                return;
            }

            console.log("Updating product with ID:", productId);
            console.log("Product details being updated:", product);

            const { error } = await supabase
                .from("Products")
                .update({
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    type: product.type,
                    size: product.size,
                    color: product.color,
                    brand: product.brand,
                    sale: product.sale,
                    gender: product.gender,
                })
                .eq("id", productId);

            if (error) {
                throw new Error(error.message);
            }

            alert("Product updated successfully!");
            goto("/admin");
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                alert("Failed to update product. Please try again.");
            } else {
                console.error("An unknown error occurred:", err);
                alert("An unknown error occurred. Redirecting...");
            }
        }
    }


</script>

<main class="edit-product-page">
    <h1>Edit Product</h1>
    <form class="product-form" on:submit|preventDefault={updateProduct}>
        <!-- Name -->
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={product.name} required />

        <!-- Price -->
        <label for="price">Price:</label>
        <input type="number" id="price" bind:value={product.price} min="0" required />

        <!-- Image Upload -->
        <label for="image">Image:</label>
        <div
                class="image-upload"
                class:drag-over={dragOver}
                on:dragover|preventDefault={() => (dragOver = true)}
                on:dragleave|preventDefault={() => (dragOver = false)}
                on:drop|preventDefault={handleImageUpload}
        >
            <p>{dragOver ? "Drop your image here" : "Drag and drop an image or click to upload"}</p>
            <input type="file" id="image" on:change={handleImageUpload} accept="image/*" />
        </div>
        <!--{#if product.image}-->
        <!--    <img src={`https://<your-supabase-project>.supabase.co/storage/v1/object/${product.image}`} alt="Uploaded image preview" class="image-preview" />-->
        <!--{/if}-->
        <!-- Other Fields -->
        <label for="type">Type:</label>
        <select id="type" bind:value={product.type} required>
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
            <option value="jacket">Jacket</option>
            <option value="coat">Coat</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
        </select>

        <label for="size">Size:</label>
        <input id="size" type="number" bind:value={product.size} min="0" required />

        <label for="color">Color:</label>
        <select id="color" bind:value={product.color} required>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="orange">Orange</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
            <option value="yellow">Yellow</option>
            <option value="gray">Gray</option>
            <option value="brown">Brown</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
        </select>

        <label for="brand">Brand:</label>
        <select id="brand" bind:value={product.brand} required>
            <option value="adidas">Adidas</option>
            <option value="converse">Converse</option>
            <option value="nike">Nike</option>
            <option value="puma">Puma</option>
            <option value="reebok">Reebok</option>
        </select>

        <label for="sale">Sale (%):</label>
        <input id="sale" type="number" bind:value={product.sale} min="0" max="100" required />

        <label for="gender">Gender:</label>
        <select id="gender" bind:value={product.gender} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>

        <button type="submit" class="submit-button" disabled={uploadingImage}>
            {uploadingImage ? "Saving..." : "Save Changes"}
        </button>
    </form>
</main>

<style>
    .add-product-page {
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.8rem;
        color: #333;
    }

    .product-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        font-size: 1rem;
        color: #333;
        margin-bottom: 0.5rem;
    }

    input, select {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    input:focus, select:focus {
        border-color: #2196f3;
        outline: none;
        box-shadow: 0 0 4px rgba(33, 150, 243, 0.5);
    }

    .image-upload {
        border: 2px dashed #ddd;
        padding: 1rem;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.3s;
    }

    .image-upload.drag-over {
        border-color: #2196f3;
    }

    .image-preview {
        margin-top: 1rem;
        max-width: 100%;
        height: auto;
        border-radius: 8px;
    }

    .submit-button {
        padding: 0.8rem;
        font-size: 1rem;
        color: #fff;
        background-color: #4caf50;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .submit-button:hover {
        background-color: #45a049;
    }

    .submit-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .add-product-page {
            padding: 1rem;
        }

        input, select {
            font-size: 0.9rem;
        }

        .submit-button {
            font-size: 0.9rem;
        }
    }

</style>
