import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }) {

    if (!locals.user) {
        return json({ success: false, message: 'User not authenticated' });
    }

    const { data: users} = await supabase
        .from('users')
        .select('id, name, surname, email, role');

    // console.log(users);
    return json({ success: true, users, currentUserId: locals.user.id });

}

export async function POST({ request }) {

    const { userId, role } = await request.json();

    await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

    return json({ success: true });

}
