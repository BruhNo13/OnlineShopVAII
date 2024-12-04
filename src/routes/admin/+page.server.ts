import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    console.log('Locals user:', locals.user);

    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(303, '/');
    }

    return {
        user: locals.user,
    };
}
