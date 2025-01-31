import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<{ products: any[] }> => {
    console.log('Loading products...');
    try {
        const { data, error } = await supabase
            .from('Products')
            .select('id, name, image, price, type, color, brand, sale, gender');

        if (error) {
            console.error('Error fetching products from Supabase:', error.message);
            return { products: [] };
        }

        const urls = data.map((product) => {
            const { data } = supabase.storage.from('images').getPublicUrl(product.image);
            return { id: product.id, image: data.publicUrl || '/images/default-image.jpg' };
        });

        const products = data.map((product) => {
            const urlObj = urls.find((url) => url.id === product.id);
            return {
                id: product.id,
                name: product.name,
                image: urlObj?.image || '/images/default-image.jpg',
                price: product.price,
                type: product.type,
                color: product.color,
                brand: product.brand,
                sale: product.sale,
                gender: product.gender,
            };
        });

        // console.log('Returning products to client:', products);
        return { products };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { products: [] };
    }
};
