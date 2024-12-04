import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET() {
    const { data: products, error } = await supabase.from('Products').select('*');
    if (error) {
        return json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
    }

    return json({ success: true, products });
}

export async function POST({ request }) {
    const product = await request.json();

    if (!/^[a-zA-Z\s-]+$/.test(product.name)) {
        return json({ success: false, message: 'Invalid name: Only letters, spaces, and hyphens are allowed.' }, { status: 400 });
    }
    if (product.price < 0 || isNaN(product.price)) {
        return json({ success: false, message: 'Invalid price: Must be a positive number or zero.' }, { status: 400 });
    }
    if (product.size <= 0 || isNaN(product.size)) {
        return json({ success: false, message: 'Invalid size: Must be a number greater than 0.' }, { status: 400 });
    }
    if (product.sale < 0 || product.sale > 100 || isNaN(product.sale)) {
        return json({ success: false, message: 'Invalid sale: Must be a number between 0 and 100.' }, { status: 400 });
    }

    const { error } = await supabase.from('Products').insert([product]);

    if (error) {
        return json({ success: false, message: 'Failed to add product.' }, { status: 500 });
    }

    return json({ success: true, message: 'Product added successfully.' });
}


export async function DELETE({ request }) {
    try {
        const { id } = await request.json();

        console.log('Received ID for deletion:', id);

        const { error } = await supabase.from('Products').delete().eq('id', id);

        if (error) {
            console.error('Error deleting product:', error.message);
            return json({ success: false, message: 'Failed to delete product.' }, { status: 500 });
        }

        return json({ success: true, message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

