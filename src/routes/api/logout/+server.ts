import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const POST = async ({ cookies }) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error logging out:', error.message);
        return json({ error: 'Failed to log out' });
    }

    cookies.delete('sb:token', {
        path: '/',
    });

    return json({ success: true, message: 'Logout successful!' });
};
