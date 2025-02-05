import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET = async ({ params }) => {
    const productId = params.id;

    const { data: reviews } = await supabase
        .from('Reviews')
        .select('id, rating, comment, created_at, user_id, Users(user_name)')
        .eq('product_id', productId);

    return json({ success: true, reviews });
};

export const POST = async ({ request, params, locals }) => {
    const { id: productId } = params;
    const { rating, comment } = await request.json();
    const { user } = locals;

    if (!user) {
        return json({ success: false, message: 'Not authenticated' });
    }

    const { data } = await supabase
        .from('Reviews')
        .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            comment,
            created_at: new Date(),
        })
        .select()
        .single();

    return json(data);
};
