import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { z } from 'zod';

const reviewSchema = z.object({
    rating: z
        .number()
        .min(0, 'Rating must be at least 0.')
        .max(5, 'Rating cannot exceed 5.'),
    comment: z
        .string()
        .min(1, 'Comment must not be empty.')
        .max(500, 'Comment cannot exceed 500 characters.'),
});

export const GET = async ({ params }) => {
    const productId = params.id;

    const { data: reviews, error: reviewsError } = await supabase
        .from('Reviews')
        .select('id, rating, comment, created_at, user_id')
        .eq('product_id', productId);

    if (reviewsError) {
        return json({ success: false, message: 'Failed to fetch reviews.' });
    }

    const userIds = reviews.map((review) => review.user_id);

    if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, name, surname')
            .in('id', userIds);

        if (usersError) {
            return json({ success: false, message: 'Failed to fetch user data.' });
        }

        const reviewsWithUserNames = reviews.map((review) => {
            const user = users.find((u) => u.id === review.user_id);
            return {
                ...review,
                user_name: user ? `${user.name} ${user.surname}` : 'Anonymous',
            };
        });

        return json({ success: true, reviews: reviewsWithUserNames });
    }

    return json({ success: true, reviews });
};


export const POST = async ({ request, params, locals }) => {
    const { id: productId } = params;
    const { user } = locals;

    const body = await request.json();

    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
        return json(
            { success: false, message: 'Validation failed.', errors: validationResult.error.errors },
        );
    }
    const { rating, comment } = validationResult.data;

    if (!user) {
        return json({ success: false, message: 'Not authenticated' });
    }

    const { data } = await supabase
        .from('Reviews')
        .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            comment,
            created_at: new Date(),
        })
        .select()
        .single();

    return json(data);
};
