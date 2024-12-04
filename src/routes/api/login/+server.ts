import { json } from '@sveltejs/kit';
import { supabase } from '../../../lib/supabase';

export async function POST({ request }) {
    const { email, password } = await request.json();

    try {
        const { data: user, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !user) {
            return json({ success: false, message: 'Incorrect email or password.' });
        }

        const { data: userDetails, error: userDetailsError } = await supabase
            .from('users')
            .select('name, role')
            .eq('email', email)
            .single();

        if (userDetailsError || !userDetails) {
            return json({ success: false, message: 'Failed to retrieve user details.' });
        }

        return json({
            success: true,
            message: 'Login successful!',
            user: userDetails.name,
        });
    } catch (err) {
        console.error('An unexpected error occurred:', err);
        return json({ success: false, message: 'An unexpected error occurred.' });
    }
}

