<script lang="ts">
    import { goto } from "$app/navigation";

    // Hodnoty predvyplníme údajmi načítanými z backendu
    export let data: { product: any };
    type Size = {
        size: number;
        quantity: number;
    };

    let product = structuredClone(data.product); // Skopírujeme dáta produktu, aby sme ich mohli upraviť
    let dragOver = false;
    let uploadingImage = false;

    function addSizeField() {
        product.sizes = [...product.sizes, { size: 0, quantity: 0 }];
    }

    function removeSizeField(index: number) {
        product.sizes = product.sizes.filter((_:Size, i: number) => i !== index);
    }


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

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/products/images", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                alert("Failed to upload image: " + result.message);
                return;
            }

            product.image = result.filePath;
            alert("Image uploaded successfully!");
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            uploadingImage = false;
        }
    }

    async function updateProduct() {
        try {
            const response = await fetch(`/admin/editProduct/${product.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });

            const result = await response.json();

            if (!result.success) {
                alert('Failed to update product. Please try again.');
                return;
            }

            alert('Product updated successfully!');
            goto('/admin');
        } catch (err) {
            console.error('Error updating product:', err);
            alert('Failed to update product. Please try again.');
        }
    }

</script>

<main class="add-product-page">
    <h1>Edit Product</h1>
    <form class="product-form" on:submit|preventDefault={updateProduct}>
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={product.name} placeholder="Enter product name" required />

        <label for="price">Price:</label>
        <input type="number" id="price" bind:value={product.price} placeholder="Enter price" min="0" required />

        <label for="image">Image:</label>
        <div
                class="image-upload"
                on:dragover|preventDefault={() => (dragOver = true)}
                on:dragleave|preventDefault={() => (dragOver = false)}
                on:drop|preventDefault={handleImageUpload}
        >
            <p>{dragOver ? "Drop your image here" : "Drag and drop an image or click to upload"}</p>
            <input type="file" id="image" on:change={handleImageUpload} />
        </div>

        <label for="type">Type:</label>
        <select id="type" bind:value={product.type} required>
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
            <option value="jacket">Jacket</option>
            <option value="coat">Coat</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
        </select>

        <label for="color">Color:</label>
        <select id="color" bind:value={product.color} required>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="white">White</option>
            <option value="black">Black</option>
        </select>

        <label for="brand">Brand:</label>
        <select id="brand" bind:value={product.brand} required>
            <option value="adidas">Adidas</option>
            <option value="nike">Nike</option>
            <option value="puma">Puma</option>
        </select>

        <label for="sale">Sale (%):</label>
        <input type="number" id="sale" bind:value={product.sale} placeholder="Enter sale percentage" min="0" max="100" required />

        <label for="gender">Gender:</label>
        <select id="gender" bind:value={product.gender} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>

        <label>Sizes:</label>
        <div class="sizes-container">
            <div class="size-header">
                <span>Size</span>
                <span>Quantity</span>
                <span></span>
            </div>
            {#each product.sizes as sizeItem, index}
                <div class="size-row">
                    <input
                            type="number"
                            placeholder="Size"
                            bind:value={sizeItem.size}
                            min="1"
                            required
                    />
                    <input
                            type="number"
                            placeholder="Quantity"
                            bind:value={sizeItem.quantity}
                            min="0"
                            required
                    />
                    <button
                            type="button"
                            class="delete-size-button"
                            on:click={() => removeSizeField(index)}
                    >
                        Delete
                    </button>
                </div>
            {/each}
            <button type="button" class="add-size-button" on:click={addSizeField}>Add Size</button>
        </div>

        <button type="submit" class="submit-button">Save Changes</button>
    </form>
</main>

<style>
    .add-product-page {
        max-width: 800px;
        margin: 2rem auto;
        padding: 1.5rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 2rem;
        color: #333;
    }

    .product-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    label {
        font-size: 1rem;
        color: #333;
    }

    input, select {
        padding: 0.6rem;
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

    .sizes-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .size-header {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .size-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 1rem;
        align-items: center;
    }

    .add-size-button {
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .add-size-button:hover {
        background-color: #45a049;
    }

    .delete-size-button {
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .delete-size-button:hover {
        background-color: #d32f2f;
    }

    .submit-button {
        background-color: #4caf50;
        color: white;
        padding: 0.8rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .submit-button:hover {
        background-color: #45a049;
    }

    @media (max-width: 768px) {
        .add-product-page {
            padding: 1rem;
        }

        input, select {
            font-size: 0.9rem;
        }

        .submit-button {
            font-size: 1rem;
        }
    }
</style>
