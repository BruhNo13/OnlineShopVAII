import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async ({ locals }) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            console.log('No active session found.');
            return { user: null, role: null };
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('name, role')
            .eq('id', session.user.id)
            .single();

        if (userError || !user) {
            console.error('User not found in the database.');
            return { user: null, role: null };
        }

        return {
            user: user.name,
            role: user.role,
        };
    } catch (err) {
        console.error('Unexpected error in +layout.server.ts:', err);
        return { user: null, role: null };
    }
};