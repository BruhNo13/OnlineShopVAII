import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const { productId, size, quantity } = await request.json();

    if (!productId || !size || !quantity) {
        return json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const { error } = await supabase
            .from('Cart')
            .insert({
                user_id: user.id,
                product_id: productId,
                size,
                quantity,
            });

        if (error) {
            console.error('Error adding to cart:', error.message);
            return json({ success: false, message: 'Failed to add product to cart' }, { status: 500 });
        }

        return json({ success: true, message: 'Product added to cart successfully' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return json({ success: false, message: 'Unexpected server error' }, { status: 500 });
    }
}
