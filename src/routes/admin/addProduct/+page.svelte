<script lang="ts">
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
        gender: "male",
    };

    let errors = {
        name: "",
        price: "",
        size: "",
        sale: "",
    };

    let dragOver = false;
    let uploadingImage = false;

    async function handleImageUpload(event: Event | DragEvent) {
        uploadingImage = true;

        let file: File | null = null;

        if (event instanceof DragEvent && event.dataTransfer?.files) {
            file = event.dataTransfer.files[0];
        } else if (event.target instanceof HTMLInputElement && event.target.files) {
            file = event.target.files[0];
        }

        if (!file) {
            alert('Please select a valid file.');
            uploadingImage = false;
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/products/images', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                alert('Failed to upload image: ' + result.message);
                return;
            }

            product.image = result.filePath;
            alert(result.message);
        } catch (err) {
            console.error('Unexpected error uploading image:', err);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            uploadingImage = false;
        }
    }

    function validateForm(): boolean {
        let isValid = true;

        if (!/^[a-zA-Z\s-]+$/.test(product.name)) {
            errors.name = "Name can only contain letters, spaces, and hyphens.";
            isValid = false;
        } else {
            errors.name = "";
        }

        if (product.price < 0 || isNaN(product.price)) {
            errors.price = "Price must be a positive number or zero.";
            isValid = false;
        } else {
            errors.price = "";
        }

        if (product.size <= 0 || isNaN(product.size)) {
            errors.size = "Size must be a number greater than 0.";
            isValid = false;
        } else {
            errors.size = "";
        }

        if (product.sale < 0 || product.sale > 100 || isNaN(product.sale)) {
            errors.sale = "Sale must be a number between 0 and 100.";
            isValid = false;
        } else {
            errors.sale = "";
        }

        return isValid;
    }

    async function addProduct() {
        if (!validateForm()) {
            alert("Please fix the errors before submitting.");
            return;
        }

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            const result = await response.json();

            if (!result.success) {
                alert("Failed to add product: " + result.message);
                return;
            }

            alert("Product added successfully!");
            goto("/admin");
        } catch (err) {
            console.error("Unexpected error adding product:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    }
</script>

<main class="add-product-page">
    <h1>Add New Product</h1>
    <form class="product-form" on:submit|preventDefault={addProduct}>
        <!-- Name -->
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={product.name} required />
        {#if errors.name}<p class="error">{errors.name}</p>{/if}

        <!-- Price -->
        <label for="price">Price:</label>
        <input type="number" id="price" bind:value={product.price} min="0" required />
        {#if errors.price}<p class="error">{errors.price}</p>{/if}

        <!-- Image -->
        <label for="image">Image:</label>
        <div
                class="image-upload"
                on:dragover|preventDefault={() => (dragOver = true)}
                on:dragleave|preventDefault={() => (dragOver = false)}
                on:drop|preventDefault={handleImageUpload}
        >
        <p>{dragOver ? "Drop your image here" : "Drag and drop an image or click to upload"}</p>
        <input
                type="file"
                id="image"
                on:change={handleImageUpload}
        />
        </div>

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
        <input type="number" id="size" bind:value={product.size} min="1" required />
        {#if errors.size}<p class="error">{errors.size}</p>{/if}

        <!-- Color -->
        <label for="color">Color:</label>
        <select id="color" bind:value={product.color} required>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="white">White</option>
            <option value="black">Black</option>
        </select>

        <!-- Brand -->
        <label for="brand">Brand:</label>
        <select id="brand" bind:value={product.brand} required>
            <option value="adidas">Adidas</option>
            <option value="nike">Nike</option>
            <option value="puma">Puma</option>
        </select>

        <!-- Sale -->
        <label for="sale">Sale (%):</label>
        <input type="number" id="sale" bind:value={product.sale} min="0" max="100" required />
        {#if errors.sale}<p class="error">{errors.sale}</p>{/if}

        <!-- Gender -->
        <label for="gender">Gender:</label>
        <select id="gender" bind:value={product.gender} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>

        <!-- Submit Button -->
        <button type="submit" class="submit-button">Add Product</button>
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

    .error {
        color: red;
        font-size: 0.9rem;
        margin: 0.5rem 0;
    }

</style>