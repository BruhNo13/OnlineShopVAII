import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('sb:token');

    if (session) {
        const { data: user, error } = await supabase.auth.getUser(session);

        if (!error && user) {
            const { data: userDetails, error: userDetailsError } = await supabase
                .from('users')
                .select('id, name, role')
                .eq('id', user.user.id)
                .single();

            if (!userDetailsError) {
                event.locals.user = userDetails;
            } else {
                event.locals.user = null;
            }
        } else {
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }
    // console.log('hooks');
    return resolve(event);
};
