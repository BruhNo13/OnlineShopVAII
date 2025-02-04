import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }: { locals: App.Locals }) {
    const user = locals.user;

    if (!user) {
        console.warn('User is not logged in.');
        return json({ success: false, message: 'User not logged in.' }, { status: 401 });
    }

    try {

        const { data: cartItems, error: cartError } = await supabase
            .from('Cart')
            .select('id, product_id, quantity, size')
            .eq('user_id', user.id);

        if (cartError) {
            console.error('Error fetching cart items:', cartError.message);
            return json({ success: false, message: 'Failed to fetch cart items.' }, { status: 500 });
        }

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
            return json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
        }

        const productsWithImages = products.map((product) => {
            const { data } = supabase.storage.from('images').getPublicUrl(product.image || '');
            const publicUrl = data?.publicUrl || '/images/default-image.jpg';
            return {
                ...product,
                image: publicUrl,
            };
        });

        const cartItemsWithProducts = cartItems.map((item) => {
            const product = productsWithImages.find((product) => product.id === item.product_id);
            const price = product ? product.price : 0;
            console.log(`Cart Item ID: ${item.id}, Linked Product ID: ${product?.id}, Price: ${price}`);
            return {
                ...item,
                product,
                price,
            };
        });

        return json({ success: true, cartItems: cartItemsWithProducts });
    } catch (error: any) {
        console.error('Unexpected server error:', error);
        return json(
            { success: false, message: 'An unexpected error occurred.', error: error.message },
            { status: 500 }
        );
    }
}




// Pridanie položky do košíka
export async function POST({ request, locals }) {
    const { user } = locals;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    const { error } = await supabase
        .from('Cart')
        .insert({ user_id: user.id, product_id: productId, quantity });

    if (error) {
        console.error('Error adding item to cart:', error.message);
        return json({ success: false, message: 'Failed to add item to cart.' }, { status: 500 });
    }

    return json({ success: true, message: 'Item added to cart.' });
}

// Odstránenie položky z košíka
export async function DELETE({ request, locals }) {
    const { user } = locals;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' }, { status: 401 });
    }

    const { cartItemId } = await request.json();

    const { error } = await supabase.from('Cart').delete().eq('id', cartItemId);

    if (error) {
        console.error('Error removing item from cart:', error.message);
        return json({ success: false, message: 'Failed to remove item from cart.' }, { status: 500 });
    }

    return json({ success: true, message: 'Item removed from cart.' });
}

export async function PATCH({ request, locals }: { request: Request; locals: App.Locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' }, { status: 401 });
    }

    const { cartItemId, quantity } = await request.json();

    const { error } = await supabase
        .from('Cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error updating cart item quantity:', error.message);
        return json({ success: false, message: 'Failed to update cart item quantity.' }, { status: 500 });
    }

    return json({ success: true, message: 'Cart item quantity updated successfully.' });
}

