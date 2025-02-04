import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }) {
    try {
        if (!locals.user) {
            return json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, surname, email, role');

        if (error) {
            console.error('Error fetching users:', error.message);
            return json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
        }
        console.log(users);
        return json({ success: true, users, currentUserId: locals.user.id });
    } catch (err) {
        console.error('Unexpected error fetching users:', err);
        return json({ success: false, message: 'Unexpected server error' }, { status: 500 });
    }
}



export async function POST({ request }) {
    try {
        const { userId, role } = await request.json();

        const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId);

        if (error) {
            console.error('Error updating user role:', error.message);
            return json({ success: false, message: 'Failed to update user role' }, { status: 500 });
        }

        return json({ success: true });
    } catch (err) {
        console.error('Unexpected error updating user role:', err);
        return json({ success: false, message: 'Unexpected server error' }, { status: 500 });
    }
}
