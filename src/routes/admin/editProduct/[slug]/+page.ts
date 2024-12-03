import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return {
        productId: params.slug // Pass the `slug` parameter as `productId`
    };
};
