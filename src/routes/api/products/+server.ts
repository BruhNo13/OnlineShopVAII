import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET() {
    const { data: products } = await supabase
        .from('Products')
        .select('*');

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

    if (!Array.isArray(product.sizes) || product.sizes.some((size) => size.size <= 0 || size.quantity < 0)) {
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

    if (productError || !productData) {
        console.error('Error inserting product:', productError?.message);
        return json(
            { success: false, message: 'Failed to add product. Please try again later.' },
            { status: 500 }
        );
    }

    const productId = productData.id;

    const sizeInsertData = product.sizes.map(({ size, quantity }) => ({
        product_id: productId,
        size,
        quantity
    }));

    const { error: sizeError } = await supabase
        .from('Product_Sizes')
        .insert(sizeInsertData);

    if (sizeError) {
        console.error('Error inserting product sizes:', sizeError.message);
        return json(
            { success: false, message: 'Failed to add product sizes. Please try again later.' },
            { status: 500 }
        );
    }

    return json({ success: true, message: 'Product added successfully.' });
}


export async function DELETE({ request }) {

    const { id } = await request.json();

    console.log('Received ID for deletion:', id);

    await supabase
        .from('Product_Sizes')
        .delete()
        .eq('product_id', id);

    await supabase
        .from('Products')
        .delete()
        .eq('id', id);

    return json({ success: true, message: 'Product and its sizes deleted successfully.' });
}


