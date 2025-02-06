import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { z } from 'zod';

const sizeSchema = z.object({
    size: z.number().min(1, "Size must be greater than 0."),
    quantity: z.number().min(0, "Quantity must be 0 or greater.")
});

const productSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens."),
    price: z.number()
        .min(0, "Price must be a positive number or zero."),
    image: z.string().optional(),
    type: z.enum(["tshirt", "hoodie", "jacket", "coat", "pants", "shoes"]),
    sizes: z.array(sizeSchema).nonempty("At least one size must be specified."),
    color: z.enum(["red", "blue", "green", "white", "black"]),
    brand: z.enum(["adidas", "nike", "puma"]),
    sale: z.number()
        .min(0, "Sale must be at least 0.")
        .max(100, "Sale cannot exceed 100."),
    gender: z.enum(["male", "female", "other"]),
});

export async function GET({ params }) {
    const { id } = params;

    if (!id) {
        return json({ success: false, message: "Missing product ID" });
    }

    const { data: product } = await supabase
        .from('Products')
        .select('*')
        .eq('id', id)
        .single();

    const { data: sizes } = await supabase
        .from('Product_Sizes')
        .select('size, quantity')
        .eq('product_id', id);

    product.sizes = sizes || [];

    return json({ success: true, product });

}

export async function POST({ request, params }: { request: Request; params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return json({ success: false, message: "Missing product ID" }, { status: 400 });
    }

    const productPayload = await request.json();
    const validation = productSchema.safeParse(productPayload);

    if (!validation.success) {
        return json(
            { success: false, message: "Validation failed", errors: validation.error.errors },
        );
    }

    const product = validation.data;

    await supabase
        .from('Products')
        .update({
            name: product.name,
            price: product.price,
            image: product.image,
            type: product.type,
            color: product.color,
            brand: product.brand,
            sale: product.sale,
            gender: product.gender,
        })
        .eq('id', id);

    await supabase
        .from('Product_Sizes')
        .delete()
        .eq('product_id', id);

    const sizeInsertData = product.sizes.map((size: { size: number; quantity: number }) => ({
        product_id: id,
        size: size.size,
        quantity: size.quantity,
    }));

    await supabase
        .from('Product_Sizes')
        .insert(sizeInsertData);

    return json({ success: true, message: "Product updated successfully." });
}

