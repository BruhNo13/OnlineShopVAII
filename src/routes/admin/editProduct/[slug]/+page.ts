import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
    const response = await fetch(`/admin/editProduct/${params.slug}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error('Failed to fetch product data');
    }

    return {
        product: result.product,
    };
};
