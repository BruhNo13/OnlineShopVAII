import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const product = await request.json();

    if (!product.name || product.price < 0 || product.sale < 0 || product.sale > 100 || !product.type || !product.size || !product.color || !product.brand || !product.gender) {
        return new Response(JSON.stringify({ error: 'Invalid product data. Please ensure all fields are valid.' }), {
            status: 400
        });
    }

    const { error } = await supabase.from('Products').insert([product]);

    if (error) {
        console.error('Error adding product:', error.message);
        return new Response(JSON.stringify({ error: 'Failed to add product.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Product added successfully!' }), { status: 200 });
};
