import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const POST = async () => {

    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
        return json({ error: 'Failed to log out' }, { status: 500 });
    }
    return json({ success: true });

};
