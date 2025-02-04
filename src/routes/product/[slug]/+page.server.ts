import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    const { data: product, error: productError } = await supabase
        .from('Products')
        .select('*')
        .eq('id', slug)
        .single();

    if (productError || !product) {
        throw new Error('Nepodarilo sa načítať produkt.');
    }

    const { data: sizes, error: sizesError } = await supabase
        .from('Product_Sizes')
        .select('size, quantity')
        .eq('product_id', slug);

    if (sizesError) {
        throw new Error('Nepodarilo sa načítať veľkosti produktu.');
    }

    product.sizes = sizes || [];

    if (product.image) {
        const { data: publicData } = supabase.storage
            .from('images')
            .getPublicUrl(product.image);

        product.image = publicData?.publicUrl || product.image;
    }

    const { data: reviews, error: reviewsError } = await supabase
        .from('Reviews')
        .select('*')
        .eq('product_id', slug)
        .order('created_at', { ascending: false });

    if (reviewsError) {
        console.error('Chyba pri načítaní recenzií:', reviewsError.message);
        throw new Error('Nepodarilo sa načítať recenzie.');
    }

    const userIds = reviews.map((review) => review.user_id);
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, surname')
        .in('id', userIds);

    if (usersError) {
        console.error('Chyba pri načítaní používateľov:', usersError.message);
        throw new Error('Nepodarilo sa načítať údaje používateľov.');
    }

    const reviewsWithUsers = reviews.map((review) => {
        const user = users.find((u) => u.id === review.user_id);
        return {
            ...review,
            user_name: user ? `${user.name} ${user.surname}` : 'Anonymous',
        };
    });

    product.reviews = reviewsWithUsers;

    return { product };
};
