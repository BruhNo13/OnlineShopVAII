import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ params }) {
    const { id } = params;

    try {
        const { data: product, error: productError } = await supabase
            .from('Products')
            .select('*')
            .eq('id', id)
            .single();

        if (productError || !product) {
            console.error('Error fetching product:', productError?.message || 'Product not found');
            return json({ success: false, message: 'Product not found.' }, { status: 404 });
        }

        const { data: sizes, error: sizesError } = await supabase
            .from('Product_Sizes')
            .select('size, quantity')
            .eq('product_id', id);

        if (sizesError) {
            console.error('Error fetching product sizes:', sizesError.message);
            return json({ success: false, message: 'Failed to fetch product sizes.' }, { status: 500 });
        }

        product.sizes = sizes || [];

        return json({ success: true, product });
    } catch (err) {
        console.error('Unexpected server error:', err);
        return json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST({ request, params }: { request: Request; params: { id: string } }) {
    const { id } = params;

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

        if (!Array.isArray(product.sizes) || product.sizes.some(size => size.size <= 0 || size.quantity < 0)) {
            return json(
                { success: false, message: 'Invalid sizes: Each size must have a positive size and a non-negative quantity.' },
                { status: 400 }
            );
        }

        const { error: productError } = await supabase
            .from('Products')
            .update({
                name: product.name,
                price: product.price,
                image: product.image,
                type: product.type,
                color: product.color,
                brand: product.brand,
                sale: product.sale,
                gender: product.gender
            })
            .eq('id', id);

        if (productError) {
            console.error('Error updating product:', productError.message);
            return json({ success: false, message: 'Failed to update product.' }, { status: 500 });
        }

        const { error: deleteSizesError } = await supabase
            .from('Product_Sizes')
            .delete()
            .eq('product_id', id);

        if (deleteSizesError) {
            console.error('Error deleting old sizes:', deleteSizesError.message);
            return json({ success: false, message: 'Failed to delete old sizes.' }, { status: 500 });
        }

        const sizeInsertData = product.sizes.map(size => ({
            product_id: id,
            size: size.size,
            quantity: size.quantity
        }));

        const { error: insertSizesError } = await supabase.from('Product_Sizes').insert(sizeInsertData);

        if (insertSizesError) {
            console.error('Error adding new sizes:', insertSizesError.message);
            return json({ success: false, message: 'Failed to add new sizes.' }, { status: 500 });
        }

        return json({ success: true, message: 'Product updated successfully.' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

