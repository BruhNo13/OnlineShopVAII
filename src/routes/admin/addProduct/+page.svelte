<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { goto } from "$app/navigation";

    let product = {
        name: "",
        price: 0,
        image: "",
        type: "tshirt",
        size: 0,
        color: "red",
        brand: "adidas",
        sale: 0,
        gender: "male"
    };

    let dragOver = false;
    let uploadingImage = false;

    async function handleImageUpload(event: DragEvent | Event) {
        uploadingImage = true;
        let file: File | null = null;

        if (event instanceof DragEvent && event.dataTransfer?.files) {
            file = event.dataTransfer.files[0];
        }

        else if (event.target instanceof HTMLInputElement && event.target.files) {
            file = event.target.files[0];
        }

        if (!file) {
            alert("Please select a valid file.");
            uploadingImage = false;
            return;
        }

        const filePath = `public/${file.name}`;

        const { data: existingFile, error: listError } = await supabase.storage
            .from("images")
            .list("public", { search: file.name });

        if (listError) {
            console.error("Error checking existing file:", listError.message);
            alert("Failed to verify if the file already exists. Please try again.");
            uploadingImage = false;
            return;
        }

        if (existingFile && existingFile.length > 0) {
            product.image = filePath;
            alert("File already exists. Using the existing file.");
            uploadingImage = false;
            return;
        }

        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

        if (uploadError) {
            console.error("Error uploading file:", uploadError.message);
            alert("Failed to upload image. Please try again.");
            uploadingImage = false;
        } else {
            product.image = filePath;
            alert("Image uploaded successfully!");
        }

        uploadingImage = false;
    }

    async function addProduct() {
        if (!product.name || product.price < 0 || product.sale < 0 || product.sale > 100 || !product.type || product.size < 0 || !product.color || !product.brand || !product.gender) {
            alert("Please fill in all required fields and ensure values are valid.");
            return;
        }

        const { error } = await supabase.from("Products").insert([product]);
        if (error) {
            console.error("Error adding product:", error.message);
            alert
            ("Failed to add product. Please try again.");
        } else {
            alert("Product added successfully!");
            goto("/admin");
        }
    }
</script>

<main class="add-product-page"> <h1>Add New Product</h1> <form class="product-form" on:submit|preventDefault={addProduct}>
    <!-- Name --> <label for="name">Name:</label> <input type="text" id="name" bind:value={product.name} required />

    <!-- Price -->
    <label for="price">Price:</label>
    <input
            type="number"
            id="price"
            bind:value={product.price}
            min="0"
            required
    />

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
    <!--    <img src={product.image} alt="Uploaded image preview" class="image-preview" />-->
    <!--{/if}-->

    <!-- Type -->
    <label for="type">Type:</label>
    <select id="type" bind:value={product.type} required>
        <option value="tshirt">T-Shirt</option>
        <option value="hoodie">Hoodie</option>
        <option value="jacket">Jacket</option>
        <option value="coat">Coat</option>
        <option value="pants">Pants</option>
        <option value="shoes">Shoes</option>
    </select>

    <!-- Size -->
    <label for="size">Size:</label>
    <input type="number" id="size" bind:value={product.size} required />

    <!-- Color -->
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

    <!-- Brand -->
    <label for="brand">Brand:</label>
    <select id="brand" bind:value={product.brand} required>
        <option value="adidas">Adidas</option>
        <option value="converse">Converse</option>
        <option value="nike">Nike</option>
        <option value="puma">Puma</option>
        <option value="reebok">Reebok</option>
    </select>

    <!-- Sale -->
    <label for="sale">Sale (%):</label>
    <input
            type="number"
            id="sale"
            bind:value={product.sale}
            min="0"
            max="100"
            required
    />

    <!-- Gender -->
    <label for="gender">Gender:</label>
    <select id="gender" bind:value={product.gender} required>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
    </select>

    <!-- Submit Button -->
    <button type="submit" class="submit-button" disabled={uploadingImage}>
        {uploadingImage ? "Uploading..." : "Add Product"}
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