import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { z } from 'zod';

const sizeSchema = z.object({
    size: z.number().min(1, "Size must be greater than 0."),
    quantity: z.number().min(0, "Quantity must be 0 or greater.")
});

const productSchema = z.object({
    name: z.string()
        .min(1, "Name is required.")
        .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens."),
    price: z.number().min(0, "Price must be a positive number or zero."),
    image: z.string().min(1, "Image is required."),
    type: z.enum(["tshirt", "hoodie", "jacket", "coat", "pants", "shoes"]),
    sizes: z.array(sizeSchema).nonempty("At least one size must be specified."),
    color: z.enum(["red", "blue", "green", "white", "black"]),
    brand: z.enum(["adidas", "nike", "puma"]),
    sale: z.number()
        .min(0, "Sale must be at least 0.")
        .max(100, "Sale cannot exceed 100."),
    gender: z.enum(["male", "female", "other"]),
});

export async function GET() {
    const { data: products } = await supabase
        .from('Products')
        .select('*');

    return json({ success: true, products });
}

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ success: false, message: 'Unauthorized' });
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', locals.user.id)
        .single();

    if (error || !userData || !['admin', 'manager'].includes(userData.role)) {
        return json({ success: false, message: 'Forbidden' });
    }

    const body = await request.json();

    const validation = productSchema.safeParse(body);

    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message).join(', ');
        return json(
            { success: false, message: errors },
        );
    }

    const product = validation.data;

    const { data: productData} = await supabase
        .from('Products')
        .insert({
            name: product.name,
            price: product.price,
            image: product.image,
            type: product.type,
            color: product.color,
            brand: product.brand,
            sale: product.sale,
            gender: product.gender
        })
        .select()
        .single();

    const productId = productData.id;

    const sizeInsertData = product.sizes.map(({ size, quantity }) => ({
        product_id: productId,
        size,
        quantity
    }));

    await supabase
        .from('Product_Sizes')
        .insert(sizeInsertData);

    return json({ success: true, message: 'Product added successfully.' });
}

export async function DELETE({ request, locals }) {
    if (!locals.user) {
        return json({ success: false, message: 'Unauthorized' });
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', locals.user.id)
        .single();

    if (error || !userData || !['admin', 'manager'].includes(userData.role)) {
        return json({ success: false, message: 'Forbidden' });
    }
    const { id } = await request.json();

    if (!id) {
        return json({ success: false, message: "Product ID is required for deletion." });
    }
    // console.log('Received ID for deletion:', id);

    await supabase
        .from('Product_Sizes')
        .delete()
        .eq('product_id', id);

    await supabase
        .from('Products')
        .delete()
        .eq('id', id);

    return json({ success: true, message: 'Product and its sizes deleted successfully.' });
}
