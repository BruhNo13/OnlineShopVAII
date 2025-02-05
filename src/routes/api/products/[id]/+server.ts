import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ params }) {
    const { id } = params;

    const { data: product } = await supabase
        .from('Products')
        .select('*')
        .eq('id', id)
        .single();

    const { data } = supabase.storage.from('images').getPublicUrl(product.image);
    product.image = data?.publicUrl;

    return json(product);
}
