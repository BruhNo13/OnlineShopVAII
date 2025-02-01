import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ success: false, message: 'User not authenticated.' }, { status: 401 });
    }

    const { productId, size, quantity } = await request.json();

    if (!productId || !size || quantity <= 0) {
        return json({ success: false, message: 'Invalid request data.' }, { status: 400 });
    }

    try {
        const { data: product, error: productError } = await supabase
            .from('Products')
            .select('price, sale')
            .eq('id', productId)
            .single();

        if (productError || !product) {
            console.error('Error fetching product:', productError?.message || 'Product not found');
            return json({ success: false, message: 'Product not found.' }, { status: 404 });
        }

        let finalPrice = product.price;
        if (product.sale > 0) {
            finalPrice = product.price - (product.price * product.sale) / 100;
        }

        console.log('Adding to cart:', { userId: locals.user.id, productId, size, quantity, finalPrice });

        const { data: existingCartItem} = await supabase
            .from('Cart')
            .select('id, quantity')
            .eq('user_id', locals.user.id)
            .eq('product_id', productId)
            .eq('size', size)
            .single();

        if (existingCartItem) {
            const { error: updateError } = await supabase
                .from('Cart')
                .update({ quantity: existingCartItem.quantity + quantity })
                .eq('id', existingCartItem.id);

            if (updateError) {
                console.error('Error updating cart:', updateError.message);
                return json({ success: false, message: 'Failed to update cart.' }, { status: 500 });
            }

            return json({ success: true, message: 'Cart updated successfully.' });
        } else {
            const { error: insertError } = await supabase
                .from('Cart')
                .insert({
                    user_id: locals.user.id,
                    product_id: productId,
                    size,
                    quantity,
                    price: finalPrice,
                    added_at: new Date().toISOString()
                });

            if (insertError) {
                console.error('Error inserting into cart:', insertError.message);
                return json({ success: false, message: 'Failed to add product to cart.' }, { status: 500 });
            }

            return json({ success: true, message: 'Product added to cart.' });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return json({ success: false, message: 'Unexpected server error.' }, { status: 500 });
    }
}
