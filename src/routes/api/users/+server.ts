import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }) {
    if (!locals.user) {
        return json({ success: false, message: 'Unauthorized' });
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', locals.user.id)
        .single();

    if (error || !userData || !['admin'].includes(userData.role)) {
        return json({ success: false, message: 'Forbidden' });
    }

    if (!locals.user) {
        return json({ success: false, message: 'User not authenticated' });
    }

    const { data: users} = await supabase
        .from('users')
        .select('id, name, surname, email, role');

    // console.log(users);
    return json({ success: true, users, currentUserId: locals.user.id });

}

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ success: false, message: 'Unauthorized' });
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', locals.user.id)
        .single();

    if (error || !userData || !['admin'].includes(userData.role)) {
        return json({ success: false, message: 'Forbidden' });
    }

    const { userId, role } = await request.json();

    await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

    return json({ success: true });

}
