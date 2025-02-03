import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        const { data: types, error: typesError } = await supabase
            .from('Products')
            .select('type');

        const { data: brands, error: brandsError } = await supabase
            .from('Products')
            .select('brand');

        const { data: colors, error: colorsError } = await supabase
            .from('Products')
            .select('color');

        const { data: sizes, error: sizesError } = await supabase
            .from('Product_Sizes')
            .select('size');

        const { data: maxPriceData, error: priceError } = await supabase
            .from('Products')
            .select('price')
            .order('price', { ascending: false })
            .limit(1);

        // console.log('MAX price:', maxPriceData);

        if (typesError || brandsError || colorsError || sizesError || priceError) {
            return json({ message: 'Error fetching filter data' }, { status: 500 });
        }

        const uniqueTypes = [...new Set(types.map((t) => t.type))];
        const uniqueBrands = [...new Set(brands.map((b) => b.brand))];
        const uniqueColors = [...new Set(colors.map((c) => c.color))];
        const uniqueSizes = [...new Set(sizes.map((s) => s.size))];
        const maxPrice = maxPriceData?.[0]?.price || 0;

        return json({
            types: uniqueTypes,
            brands: uniqueBrands,
            colors: uniqueColors,
            sizes: uniqueSizes,
            maxPrice,
        });
    } catch (error: any) {
        console.error('Server error:', error);
        return json(
            { message: 'Unexpected server error', error: error.message },
            { status: 500 }
        );
    }
}


export async function POST({ request, locals }) {
    const filters = await request.json();
    const userId = locals.user?.id;

    let query = supabase.from('Products').select('id, name, price, image, type, color, brand, sale, gender');

    if (filters.gender?.length) {
        query = query.in('gender', filters.gender);
    }

    if (filters.type?.length) {
        query = query.in('type', filters.type);
    }

    if (filters.color?.length) {
        query = query.in('color', filters.color);
    }

    if (filters.brand?.length) {
        query = query.in('brand', filters.brand);
    }

    if (filters.size?.length) {
        const { data: productIds, error: sizeError } = await supabase
            .from('Product_Sizes')
            .select('product_id')
            .in('size', filters.size);

        if (sizeError) {
            console.error('Error fetching product IDs for sizes:', sizeError.message);
            return new Response(JSON.stringify({ message: 'Failed to filter by size.' }), { status: 500 });
        }

        const ids = productIds?.map((row) => row.product_id) || [];
        query = query.in('id', ids);
    }

    if (filters.price) {
        query = query.lte('price', filters.price);
    }

    if (filters.category?.length) {
        const conditions = [];

        if (filters.category.includes('clothing')) {
            conditions.push("type.neq.shoes", "type.neq.accessory");
        }

        if (filters.category.includes('shoes')) {
            conditions.push("type.eq.shoes");
        }

        if (filters.category.includes('accessories')) {
            conditions.push("type.eq.accessory");
        }

        if (filters.category.length === 1 && filters.category.includes('clothing')) {
            query = query.not('type', 'eq', 'shoes').not('type', 'eq', 'accessory');
        } else {
            query = query.or(conditions.join(","));
        }
    }

    if (filters.discount?.length) {
        const discountCondition = filters.discount[0];

        if (discountCondition === 'Without sale') {
            query = query.eq('sale', 0);
        } else if (discountCondition === 'to 20%') {
            query = query.lte('sale', 20);
        } else if (discountCondition === 'from 20%') {
            query = query.gte('sale', 20);
        } else if (discountCondition === 'from 40%') {
            query = query.gte('sale', 40);
        } else if (discountCondition === 'All sales') {
            query = query.gt('sale', 0);
        }
    }

    const { data: products, error } = await query;
    if (error) {
        console.error('Error fetching products:', error.message);
        return new Response(JSON.stringify({ message: 'Failed to fetch products.' }), { status: 500 });
    }

    const { data: favorites, error: favoritesError } = userId
        ? await supabase.from('Favorites').select('product_id').eq('user_id', userId)
        : { data: [], error: null };

    if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError.message);
    }

    const favoriteIds = favorites?.map((fav) => fav.product_id) || [];

    const productsWithImages = products.map((product) => {
        const { data } = supabase.storage.from('images').getPublicUrl(product.image);
        return {
            ...product,
            image: data?.publicUrl || '/images/default-image.jpg',
            isFavorite: favoriteIds.includes(product.id),
        };
    });

    return new Response(JSON.stringify({ products: productsWithImages }), { status: 200 });
}
