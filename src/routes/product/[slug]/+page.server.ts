import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    // Načítanie produktu
    const { data: product, error: productError } = await supabase
        .from('Products')
        .select('*')
        .eq('id', slug)
        .single();

    if (productError || !product) {
        throw new Error('Nepodarilo sa načítať produkt.');
    }

    // Načítanie veľkostí produktu
    const { data: sizes, error: sizesError } = await supabase
        .from('Product_Sizes')
        .select('size, quantity')
        .eq('product_id', slug);

    if (sizesError) {
        throw new Error('Nepodarilo sa načítať veľkosti produktu.');
    }

    product.sizes = sizes || [];

    // Generovanie verejnej URL pre obrázok produktu
    if (product.image) {
        const { data: publicData } = supabase.storage
            .from('images')
            .getPublicUrl(product.image);

        product.image = publicData?.publicUrl || product.image;
    }

    return { product };
};
