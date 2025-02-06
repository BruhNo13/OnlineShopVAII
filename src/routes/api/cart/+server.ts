import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }: { locals: App.Locals }) {
    const user = locals.user;

    if (!user) {
        // console.error('User is not logged in.');
        return json({ success: false, message: 'User not logged in.' });
    }

    const { data: cartItems } = await supabase
        .from('Cart')
        .select('id, product_id, quantity, size')
        .eq('user_id', user.id);

    if (!cartItems || cartItems.length === 0) {
        console.log('No items found in the cart.');
        return json({ success: true, cartItems: [] });
    }

    const uniqueProductIds = [...new Set(cartItems.map((item) => item.product_id))];

    const { data: products, error: productsError } = await supabase
        .from('Products')
        .select('id, name, price, image, type, color, brand, sale, gender')
        .in('id', uniqueProductIds);

    if (productsError) {
        console.error('Error fetching products:', productsError.message);
        return json({ success: false, message: 'Failed to fetch products.' });
    }

    const productsWithImages = products.map((product) => {
        const { data } = supabase.storage.from('images').getPublicUrl(product.image);
        const publicUrl = data?.publicUrl;
        return {
            ...product,
            image: publicUrl,
        };
    });

    const cartItemsWithProducts = cartItems.map((item) => {
        const product = productsWithImages.find((product) => product.id === item.product_id);
        const price = product ? product.price : 0;
        // console.log(`Cart Item ID: ${item.id}, Linked Product ID: ${product?.id}, Price: ${price}`);
        return {
            ...item,
            product,
            price,
        };
    });

    return json({ success: true, cartItems: cartItemsWithProducts });
}

export async function POST({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' });
    }

    const { productId, size, quantity } = await request.json();

    if (!productId || !size || typeof quantity !== 'number') {
        return json({ success: false, message: 'Missing or invalid required fields' });
    }

    const { data: existingItem } = await supabase
        .from('Cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size)
        .single();


    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await supabase
            .from('Cart')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id);

        return json({ success: true, message: 'Cart item updated successfully', quantity: newQuantity });
    }

    await supabase
        .from('Cart')
        .insert({
            user_id: user.id,
            product_id: productId,
            size,
            quantity,
        });

    return json({ success: true, message: 'Product added to cart successfully', quantity });

}

export async function DELETE({ request, locals }) {
    const { user } = locals;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' });
    }

    const { cartItemId } = await request.json();

    await supabase
        .from('Cart')
        .delete()
        .eq('id', cartItemId);

    return json({ success: true, message: 'Item removed from cart.' });
}

export async function PATCH({ request, locals }: { request: Request; locals: App.Locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' });
    }

    const { cartItemId, quantity } = await request.json();

    await supabase
        .from('Cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

    const { data: cartItems} = await supabase
        .from('Cart')
        .select('quantity, price')
        .eq('user_id', user.id);

    if (!cartItems) {
        return json({ success: true, totalPrice: 0 });
    }

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
        0
    );

    return json({ success: true, totalPrice });
}



