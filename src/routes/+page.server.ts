import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }): Promise<{ products: any[] }> => {

    const { data: products, error: productsError } = await supabase
        .from('Products')
        .select('id, name, image, price, type, color, brand, sale, gender');

    if (productsError) {
        console.error('Error fetching products from Supabase:');
        return { products: [] };
    }

    const productsWithImages = products.map((product) => {
        const { data } = supabase.storage.from('images').getPublicUrl(product.image);
        return {
            ...product,
            image: data.publicUrl,
        };
    });

    let favoriteProducts: string[] = [];

    if (locals.user) {
        const { data: favorites, error: favoritesError } = await supabase
            .from('Favorites')
            .select('product_id')
            .eq('user_id', locals.user.id);

        if (favoritesError) {
            console.error('Error fetching favorite products:', favoritesError.message);
        } else {
            favoriteProducts = favorites.map((fav) => fav.product_id);
        }
    }

    const finalProducts = productsWithImages.map((product) => ({
        ...product,
        isFavorite: favoriteProducts.includes(product.id),
    }));

    return { products: finalProducts };

};
