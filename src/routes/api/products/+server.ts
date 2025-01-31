import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET() {
    const { data: products, error } = await supabase.from('Products').select('*');
    if (error) {
        return json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
    }

    return json({ success: true, products });
}

export async function POST({ request }) {
    type Size = {
        size: number;
        quantity: number;
    };

    type Product = {
        name: string;
        price: number;
        image: string;
        type: string;
        sizes: Size[];
        color: string;
        brand: string;
        sale: number;
        gender: string;
    };

    try {
        const product: Product = await request.json();

        if (!/^[a-zA-Z\s-]+$/.test(product.name)) {
            return json(
                { success: false, message: 'Invalid name: Only letters, spaces, and hyphens are allowed.' },
                { status: 400 }
            );
        }

        if (product.price < 0 || isNaN(product.price)) {
            return json(
                { success: false, message: 'Invalid price: Must be a positive number or zero.' },
                { status: 400 }
            );
        }

        if (product.sale < 0 || product.sale > 100 || isNaN(product.sale)) {
            return json(
                { success: false, message: 'Invalid sale: Must be a number between 0 and 100.' },
                { status: 400 }
            );
        }

        if (
            !Array.isArray(product.sizes) ||
            product.sizes.some((size) => size.size <= 0 || size.quantity < 0)
        ) {
            return json(
                {
                    success: false,
                    message: 'Invalid sizes: Each size must have a positive size and a non-negative quantity.'
                },
                { status: 400 }
            );
        }

        const { data: productData, error: productError } = await supabase
            .from('Products')
            .insert({
                name: product.name,
                price: product.price,
                image: product.image,
                type: product.type,
                color: product.color,
                brand: product.brand,
                sale: product.sale,
                gender: product.gender
            })
            .select()
            .single();

        if (productError) {
            console.error('Error adding product:', productError.message);
            return json({ success: false, message: 'Failed to add product.' }, { status: 500 });
        }

        const productId = productData.id;

        const sizeInsertData = product.sizes.map(({ size, quantity }) => ({
            product_id: productId,
            size,
            quantity
        }));

        console.log('Size Insert Data:', sizeInsertData);

        const { error: sizesError } = await supabase.from('Product_Sizes').insert(sizeInsertData);

        if (sizesError) {
            console.error('Error adding product sizes:', sizesError.message);
            return json(
                { success: false, message: 'Product added but failed to save sizes.' },
                { status: 500 }
            );
        }

        return json({ success: true, message: 'Product added successfully.' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}




export async function DELETE({ request }) {
    try {
        const { id } = await request.json();

        console.log('Received ID for deletion:', id);

        const { error } = await supabase.from('Products').delete().eq('id', id);

        if (error) {
            console.error('Error deleting product:', error.message);
            return json({ success: false, message: 'Failed to delete product.' }, { status: 500 });
        }

        return json({ success: true, message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

