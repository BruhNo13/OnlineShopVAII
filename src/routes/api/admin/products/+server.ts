// import { json } from '@sveltejs/kit';
// import { supabase } from '$lib/supabase';
//
// export async function GET({ locals }) {
//     const { user } = locals;
//     if (!user || user.role !== 'admin') {
//         return json({ success: false, message: 'Unauthorized' }, { status: 403 });
//     }
//
//     const { data: products, error } = await supabase.from('Products').select('*');
//     if (error) {
//         return json({ success: false, message: 'Failed to fetch products.' });
//     }
//
//     return json({ success: true, data: products });
// }
