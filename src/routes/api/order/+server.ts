import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {supabase} from "$lib/supabase";


export const POST: RequestHandler = async ({ request}) => {
    try {
        const { cartItems } = await request.json();

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('User not authenticated.');
        }

        const { data: order, error: orderError } = await supabase
            .from('Orders')
            .insert({
                user_id: user.id,
                status: 'pending',
                total_price: cartItems.reduce((sum: number, item:{price: number; quantity: number}) => sum + item.price * item.quantity, 0)
            })
            .select()
            .single();

        if (orderError) {
            throw new Error(orderError.message);
        }

        const orderItems = cartItems.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
        }));

        const { error: itemsError } = await supabase.from('Order_Items').insert(orderItems);
        if (itemsError) {
            throw new Error(itemsError.message);
        }

        const cartItemIds = cartItems.map((item: any) => item.id);
        const { error: deleteCartError } = await supabase
            .from('Cart')
            .delete()
            .in('id', cartItemIds);

        if (deleteCartError) {
            Error(deleteCartError.message);
        }

        return json({ success: true });
    } catch (error: any) {
        console.error('Error placing order:', error.message);
        return json({ success: false, message: error.message }, { status: 500 });
    }
};
