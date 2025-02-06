<script lang="ts">
    import { z } from 'zod';
    import { goto } from "$app/navigation";

    const productSchema = z.object({
        name: z.string()
            .min(1, "Name is required")
            .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens."),
        price: z.number()
            .min(0, "Price must be a positive number or zero."),
        image: z.string().min(1, "Image file is required"),
        type: z.enum(["tshirt", "hoodie", "jacket", "coat", "pants", "shoes"]),
        sizes: z.array(
            z.object({
                size: z.number().min(1, "Size must be greater than 0."),
                quantity: z.number().min(0, "Quantity must be 0 or greater.")
            })
        ).nonempty("At least one size must be specified."),
        color: z.enum(["red", "blue", "green", "white", "black"]),
        brand: z.enum(["adidas", "nike", "puma"]),
        sale: z.number()
            .min(0, "Sale must be at least 0.")
            .max(100, "Sale cannot exceed 100."),
        gender: z.enum(["male", "female", "other"]),
    });

    let product = {
        name: "",
        price: 0,
        image: "",
        type: "tshirt",
        sizes: [{ size: 0, quantity: 0 }],
        color: "red",
        brand: "adidas",
        sale: 0,
        gender: "male",
    };

    let file: File | null = null;

    let errors: Record<string, string> = {};

    let dragOver = false;
    let uploadingImage = false;

    function addSizeField() {
        product.sizes = [...product.sizes, { size: 0, quantity: 0 }];
    }

    function removeSizeField(index: number) {
        product.sizes = product.sizes.filter((sizesItem, i) => i !== index);
    }

    async function addProduct() {
        validateFormLocally();

        productSchema.parse(product);

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
        await goto("/admin");

    }

    async function handleImageUpload(event: Event | DragEvent) {
        uploadingImage = true;

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

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/products/images', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!result.success) {
            // alert('Failed to upload image: ' + result.message);
            return;
        }

        product.image = result.filePath;
        console.log("Uploaded image:", file);
        // alert(result.message);

        uploadingImage = false;

    }

    function validateFormLocally() {
        const result = productSchema.safeParse(product);

        if (result.success) {
            errors = {};
        } else {
            errors = result.error.errors.reduce((acc, err) => {
                const pathKey = err.path[0] as string;
                acc[pathKey] = err.message;
                return acc;
            }, {} as Record<string, string>);
        }
    }

</script>

<main class="add-product-page">
    <h1>Add New Product</h1>
    <form class="product-form" on:submit|preventDefault={addProduct}>

        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={product.name} placeholder="Enter product name" required />
        <p class="error">{errors.name}</p>

        <label for="price">Price:</label>
        <input type="number" id="price" bind:value={product.price} placeholder="Enter price" min="0" required />
        <p class="error">{errors.price}</p>

        <label for="image">Image:</label>
        <div
                class="image-upload"
                role="button"
                aria-label="Image upload area"
                tabindex="0"
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
        <p class="error">{errors.image}</p>

        <label for="type">Type:</label>
        <select id="type" bind:value={product.type} required>
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
            <option value="jacket">Jacket</option>
            <option value="coat">Coat</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
        </select>
        <p class="error">{errors.type}</p>

        <label for="color">Color:</label>
        <select id="color" bind:value={product.color} required>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="white">White</option>
            <option value="black">Black</option>
        </select>
        <p class="error">{errors.color}</p>

        <label for="brand">Brand:</label>
        <select id="brand" bind:value={product.brand} required>
            <option value="adidas">Adidas</option>
            <option value="nike">Nike</option>
            <option value="puma">Puma</option>
        </select>
        <p class="error">{errors.brand}</p>

        <label for="sale">Sale (%):</label>
        <input type="number" id="sale" bind:value={product.sale} placeholder="Enter sale percentage" min="0" max="100" required />
        <p class="error">{errors.sale}</p>

        <label for="gender">Gender:</label>
        <select id="gender" bind:value={product.gender} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
        <p class="error">{errors.gender}</p>

        Sizes:
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
        <p class="error">{errors.sizes}</p>

        <button type="submit" class="submit-button">Add Product</button>
    </form>
</main>

<style>
    .error {
        color: red;
        font-size: 0.9rem;
        margin-top: 0.2rem;
    }

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

    .image-upload {
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


