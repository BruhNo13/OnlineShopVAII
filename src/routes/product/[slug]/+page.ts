export const load: ({params}: { params: any }) => { productId: string } = ({ params }) => {
    return {
        productId: params.slug
    };
};