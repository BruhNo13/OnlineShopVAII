import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return json({ success: false, message: 'No file provided.' }, { status: 400 });
        }

        const fileName = file.name;
        const filePath = `public/${fileName}`;

        const { data: existingFile, error: listError } = await supabase.storage
            .from('images')
            .list('public', { search: fileName });

        if (listError) {
            console.error('Error checking existing file:', listError.message);
            return json({ success: false, message: 'Failed to verify if the file already exists.' }, { status: 500 });
        }

        if (existingFile && existingFile.length > 0) {
            return json({
                success: true,
                message: 'File already exists. Using the existing file.',
                filePath,
            });
        }

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file.stream(), {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError.message);
            return json({ success: false, message: 'Failed to upload image.' }, { status: 500 });
        }

        return json({
            success: true,
            message: 'Image uploaded successfully!',
            filePath,
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
