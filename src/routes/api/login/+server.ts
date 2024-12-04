import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request, cookies }) {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
        return json({ success: false, message: 'Invalid email or password.' });
    }

    cookies.set('sb:token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return json({ success: true, message: 'Login successful!' });
}
