import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/\d/, 'Password must contain at least one number.')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character.'),
    name: z
        .string()
        .min(2, 'Name must have at least 2 characters.')
        .regex(/^[A-Za-zÀ-ž\s-]+$/, 'Name must contain only letters, spaces, and dashes.'),
    surname: z
        .string()
        .min(2, 'Surname must have at least 2 characters.')
        .regex(/^[A-Za-zÀ-ž\s-]+$/, 'Surname must contain only letters, spaces, and dashes.'),
    gender: z.enum(['male', 'female', 'other']),
});

export async function POST({ request, cookies }) {
    const body = await request.json();

    const result = signupSchema.safeParse(body);

    if (!result.success) {
        return json(
            {
                success: false,
                message: 'Validation failed.',
                errors: result.error.errors.map((e) => ({ field: e.path[0], message: e.message })),
            },
        );
    }

    const { email, password, name, surname, gender } = result.data;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error || !data?.user) {
        return json({ success: false, message: 'Failed to sign up. Please try again later.' });
    }

    const { error: insertError } = await supabase.from('users').insert([
        {
            id: data.user.id,
            email,
            name,
            surname,
            gender,
            role: 'user',
        },
    ]);

    if (insertError) {
        return json(
            { success: false, message: 'Failed to save user details. Please try again later.' },
        );
    }

    cookies.set('sb:token', data.session?.access_token || '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return json({ success: true, message: 'Signup successful!' });
}
