import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {supabase} from "$lib/supabase";


export const POST: RequestHandler = async ({ request}) => {

    const { cartItems } = await request.json();

    const {data: { user }, error: userError} = await supabase.auth.getUser();

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

    await supabase.from('Order_Items').insert(orderItems);

    const cartItemIds = cartItems.map((item: any) => item.id);
    await supabase
        .from('Cart')
        .delete()
        .in('id', cartItemIds);

    return json({ success: true });

};
