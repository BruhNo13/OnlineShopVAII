import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET() {
    try {

        const { data: orders, error: ordersError } = await supabase
            .from('Orders')
            .select('id, order_date, total_price, status, user_id')
            .order('order_date', { ascending: false });

        if (ordersError) {
            console.error('Error fetching orders:', ordersError.message);
            return json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
        }

        if (!orders || orders.length === 0) {
            return json({ success: true, orders: [] });
        }

        const userIds = [...new Set(orders.map((order) => order.user_id))];
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, name, surname, email')
            .in('id', userIds);

        if (usersError) {
            console.error('Error fetching users:', usersError.message);
            return json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
        }

        const orderIds = orders.map((order) => order.id);
        const { data: orderItems, error: orderItemsError } = await supabase
            .from('Order_Items')
            .select('order_id, quantity, price')
            .in('order_id', orderIds);

        if (orderItemsError) {
            console.error('Error fetching order items:', orderItemsError.message);
            return json({ success: false, message: 'Failed to fetch order items' }, { status: 500 });
        }

        const ordersWithDetails = orders.map((order) => {
            const user = users.find((u) => u.id === order.user_id) || null;
            const items = orderItems.filter((item) => item.order_id === order.id);

            return {
                ...order,
                user,
                items,
            };
        });

        return json({ success: true, orders: ordersWithDetails });
    } catch (err) {
        console.error('Unexpected error fetching orders:', err);
        return json({ success: false, message: 'Unexpected server error' }, { status: 500 });
    }
}



export async function POST({ request }) {
    try {
        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return json({ success: false, message: 'Missing orderId or status' }, { status: 400 });
        }

        const { error } = await supabase
            .from('Orders')
            .update({ status })
            .eq('id', orderId);

        if (error) {
            console.error('Error updating order status:', error.message);
            return json({ success: false, message: 'Failed to update order status' }, { status: 500 });
        }

        return json({ success: true, message: 'Order status updated successfully' });
    } catch (err) {
        console.error('Unexpected error updating order status:', err);
        return json({ success: false, message: 'Unexpected server error' }, { status: 500 });
    }
}
