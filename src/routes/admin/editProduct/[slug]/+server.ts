import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ params }) {
    const { slug } = params;

    try {
        const { data, error } = await supabase
            .from('Products')
            .select('*')
            .eq('id', slug)
            .single();

        if (error || !data) {
            console.error('Error fetching product:', error?.message || 'Product not found');
            return json({ success: false, message: 'Product not found.' }, { status: 404 });
        }

        return json({ success: true, product: data });
    } catch (err) {
        console.error('Unexpected server error:', err);
        return json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST({ request, params }) {
    const { slug } = params;
    const updatedProduct = await request.json();

    try {
        const { error } = await supabase
            .from("Products")
            .update(updatedProduct)
            .eq("id", slug);

        if (error) {
            console.error("Error updating product:", error.message);
            return json({ success: false, message: "Failed to update product." }, { status: 500 });
        }

        return json({ success: true, message: "Product updated successfully." });
    } catch (err) {
        console.error("Unexpected error updating product:", err);
        return json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
