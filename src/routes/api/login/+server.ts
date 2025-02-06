import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export async function POST({ request, cookies }) {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
        return json(
            {
                success: false,
                message: 'Validation failed.',
                errors: validationResult.error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            },
        );
    }

    const { email, password } = validationResult.data;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
        return json({ success: false, message: 'Invalid email or password.' });
    }
    cookies.set('sb:token', data.session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return json({ success: true, message: 'Login successful!' });
}
