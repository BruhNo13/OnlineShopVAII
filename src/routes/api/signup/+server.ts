import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request, cookies }) {

    const { email, password, name } = await request.json();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error || !data?.user) {
        return json({ success: false, message: 'Failed to sign up.' });
    }

    await supabase.from('users').insert([
        {
            id: data.user.id,
            email,
            name,
            role: 'user',
        },
    ]);

    cookies.set('sb:token', data.session?.access_token || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return json({ success: true, message: 'Signup successful!' });

}
