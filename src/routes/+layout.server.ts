import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async ({ locals }) => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        console.log('No active session found.');
        return {
            user: null,
            role: null,
            surname: null,
            email: null,
            gender: null
        };
    }

    const { data: user, error: userError } = await supabase
        .from('users')
        .select('name, role, surname, email, gender')
        .eq('id', session.user.id)
        .single();

    if (userError || !user) {
        console.error('User not found in the database.');
        return {
            user: null,
            role: null,
            surname: null,
            email: null,
            gender: null
        };
    }

    return {
        user: user.name,
        role: user.role,
        surname: user.surname,
        email: user.email,
        gender: user.gender,
    };
};
