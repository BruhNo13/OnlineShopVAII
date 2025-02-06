import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin' && locals.user.role !== 'manager') {
        throw redirect(303, '/');
    }

    const { data: products, error } = await supabase
        .from('Products')
        .select('id, name, price, image, type, color, brand, sale, gender');

    if (error) {
        console.error('Error loading products:', error.message);
        return { products: [] };
    }

    const urls = products.map((product) => {
        const { data } = supabase.storage.from('images').getPublicUrl(product.image);
        return { id: product.id, image: data.publicUrl};
    });

    const updatedProducts = products.map((product) => {
        const imageUrl = urls.find((url) => url.id === product.id)?.image;
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: imageUrl,
            type: product.type,
            color: product.color,
            brand: product.brand,
            sale: product.sale,
            gender: product.gender,
        };
    });

    return {
        products: updatedProducts,
        userRole: locals.user.role
    };

};
