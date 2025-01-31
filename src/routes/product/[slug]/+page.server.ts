import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    const { data: product, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', slug)
        .single();

    if (error || !product) {
        throw new Error('Nepodarilo sa načítať produkt.');
    }

    if (product.image) {
        const { data: publicData } = supabase.storage
            .from('images')
            .getPublicUrl(product.image);

        product.image = publicData?.publicUrl || product.image;
    }

    return { product };
};
