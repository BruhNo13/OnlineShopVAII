import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async () => {
    try {
        const { data, error } = await supabase
            .from('Products')
            .select('id, name, image, price');

        if (error) {
            console.error('Error fetching products:', error.message);
            return json({ error: 'Failed to fetch products' }, { status: 500 });
        }

        return json({ products: data });
    } catch (err) {
        console.error('Unexpected server error:', err);
        return json({ error: 'Unexpected server error' }, { status: 500 });
    }
};


