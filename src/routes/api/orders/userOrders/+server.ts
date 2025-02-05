import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {supabase} from "$lib/supabase";

export const GET: RequestHandler = async ({}) => {

    const {data: { user }, error: userError} = await supabase.auth.getUser();

    if (userError || !user) {
        return json({ message: 'Not authenticated' });
    }

    const { data: orders, error: ordersError } = await supabase
        .from('Orders')
        .select('*')
        .eq('user_id', user.id);

    if (ordersError) {
        throw new Error(ordersError.message);
    }

    const orderIds = orders.map((order) => order.id);
    const { data: orderItems, error: itemsError } = await supabase
        .from('Order_Items')
        .select('*')
        .in('order_id', orderIds);

    if (itemsError) {
        throw new Error(itemsError.message);
    }

    const productIds = orderItems.map((item) => item.product_id);

    const { data: products, error: productsError } = await supabase
        .from('Products')
        .select('id, name, image, price, type, color, brand, sale, gender')
        .in('id', productIds);

    if (productsError) {
        throw new Error(productsError.message);
    }

    const productsWithImages = products.map((product) => {
        const { data } = supabase.storage.from('images').getPublicUrl(product.image);
        return {
            ...product,
            image: data?.publicUrl,
        };
    });

    const ordersWithItems = orders.map((order) => {
        const items = orderItems
            .filter((item) => item.order_id === order.id)
            .map((item) => ({
                ...item,
                Product: productsWithImages.find((product) => product.id === item.product_id),
            }));

        return { ...order, Order_Items: items };
    });

    return json({ orders: ordersWithItems });

};

export const DELETE: RequestHandler = async ({ request }) => {

    const { orderId } = await request.json();

    await supabase
        .from('Orders')
        .update({ status: 'canceled' })
        .eq('id', orderId);

    return json({ success: true });

};


