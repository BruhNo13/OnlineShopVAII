import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }): Promise<{ products: any[] }> => {
    try {
        // Načítanie všetkých produktov
        const { data: products, error: productsError } = await supabase
            .from('Products')
            .select('id, name, image, price, type, color, brand, sale, gender');

        if (productsError) {
            console.error('Error fetching products from Supabase:', productsError.message);
            return { products: [] };
        }

        // Načítanie URL obrázkov pre produkty
        const productsWithImages = products.map((product) => {
            const { data } = supabase.storage.from('images').getPublicUrl(product.image);
            return {
                ...product,
                image: data.publicUrl || '/images/default-image.jpg',
            };
        });

        let favoriteProducts: string[] = [];

        if (locals.user) {
            // Načítanie obľúbených produktov pre prihláseného používateľa
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

        // Pridanie isFavorite k produktom
        const finalProducts = productsWithImages.map((product) => ({
            ...product,
            isFavorite: favoriteProducts.includes(product.id),
        }));

        return { products: finalProducts };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { products: [] };
    }
};
