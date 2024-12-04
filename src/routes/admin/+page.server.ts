import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function load({ locals }) {

    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(303, '/');
    }

    const { data: products, error } = await supabase.from('Products').select('*');

    if (error) {
        console.error('Error loading products:', error);
        throw new Error('Failed to fetch products.');
    }

    return {
        products,
    };
}
