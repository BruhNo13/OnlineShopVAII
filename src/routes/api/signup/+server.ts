import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request, cookies }) {
    try {
        const { email, password, name } = await request.json();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error || !data?.user) {
            return json({ success: false, message: error?.message || 'Failed to sign up.' });
        }

        const { error: insertError } = await supabase.from('users').insert([
            {
                id: data.user.id,
                email,
                name,
                role: 'user',
            },
        ]);

        if (insertError) {
            return json({ success: false, message: 'Failed to create user profile.' });
        }

        cookies.set('sb:token', data.session?.access_token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return json({ success: true, message: 'Signup successful!' });
    } catch (error) {
        console.error('Signup error:', error);
        return json({ success: false, message: 'An unexpected error occurred.' });
    }
}
