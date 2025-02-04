import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ params }) {
    const { id } = params;

    const { data: product, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product details:', error.message);
        return json({ success: false, message: 'Failed to fetch product details' }, { status: 500 });
    }

    if (product.image) {
        const { data } = supabase.storage.from('images').getPublicUrl(product.image);
        product.image = data?.publicUrl || '/images/default-image.jpg';
    } else {
        product.image = '/images/default-image.jpg';
    }

    return json(product);
}
