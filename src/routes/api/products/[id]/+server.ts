import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET = async ({ params }) => {
    const { id } = params;

    try {
        const { data, error } = await supabase
            .from('Products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error.message);
            return json({ error: 'Product not found' }, { status: 404 });
        }

        return json({ product: data });
    } catch (error) {
        console.error('Unexpected error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
