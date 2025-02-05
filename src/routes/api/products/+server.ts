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
        );
    }

    if (product.price < 0 || isNaN(product.price)) {
        return json(
            { success: false, message: 'Invalid price: Must be a positive number or zero.' },
        );
    }

    if (product.sale < 0 || product.sale > 100 || isNaN(product.sale)) {
        return json(
            { success: false, message: 'Invalid sale: Must be a number between 0 and 100.' },
        );
    }

    if (!Array.isArray(product.sizes) || product.sizes.some((size) => size.size <= 0 || size.quantity < 0)) {
        return json(
            {
                success: false,
                message: 'Invalid sizes: Each size must have a positive size and a non-negative quantity.'
            },
        );
    }

    const { data: productData } = await supabase
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

    const productId = productData.id;

    const sizeInsertData = product.sizes.map(({ size, quantity }) => ({
        product_id: productId,
        size,
        quantity
    }));

    // console.log('Size Insert Data:', sizeInsertData);

    await supabase
        .from('Product_Sizes')
        .insert(sizeInsertData);

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


