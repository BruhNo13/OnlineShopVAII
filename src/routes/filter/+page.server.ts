import { supabase } from '$lib/supabase';

export const load = async () => {

    const { data: products } = await supabase
        .from('Products')
        .select('type, brand, color, price');

    const { data: sizes } = await supabase
        .from('Product_Sizes')
        .select('size');

    const uniqueTypes = [...new Set(products?.map((p) => p.type) || [])];
    const uniqueBrands = [...new Set(products?.map((p) => p.brand) || [])];
    const uniqueColors = [...new Set(products?.map((p) => p.color) || [])];
    const uniqueSizes = [...new Set(sizes?.map((s) => s.size) || [])];
    const maxPrice = products?.reduce((max, p) => Math.max(max, p.price), 0) || 0;

    return {
        props: {
            filterOptions: {
                types: uniqueTypes,
                brands: uniqueBrands,
                colors: uniqueColors,
                sizes: uniqueSizes,
            },
            maxPrice,
        },
    };
};
