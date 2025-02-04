import { supabase } from '$lib/supabase';

export const load = async () => {
    try {
        const { data: types } = await supabase.from('Products').select('type');
        const { data: brands } = await supabase.from('Products').select('brand');
        const { data: colors } = await supabase.from('Products').select('color');
        const { data: sizes } = await supabase.from('Product_Sizes').select('size');
        const { data: maxPriceData } = await supabase
            .from('Products')
            .select('price')
            .order('price', { ascending: false })
            .limit(1);

        const uniqueTypes = [...new Set(types?.map((t) => t.type) || [])];
        const uniqueBrands = [...new Set(brands?.map((b) => b.brand) || [])];
        const uniqueColors = [...new Set(colors?.map((c) => c.color) || [])];
        const uniqueSizes = [...new Set(sizes?.map((s) => s.size) || [])];
        const maxPrice = maxPriceData?.[0]?.price || 0;

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
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return {
            props: {
                filterOptions: { types: [], brands: [], colors: [], sizes: [] },
                maxPrice: 0,
            },
        };
    }
};
