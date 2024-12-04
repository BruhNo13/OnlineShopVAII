import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validateName(name: string): boolean {
    const nameRegex = /^[A-Za-zÀ-ž\s-]{2,}$/;
    return nameRegex.test(name);
}

function validateGender(gender: string): boolean {
    return ['male', 'female', 'other'].includes(gender);
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password, name, surname, gender } = await request.json();

        if (!email || !password || !name || !surname || !gender) {
            return json({ error: 'All fields are required.' }, { status: 400 });
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

        if (authError) {
            console.error("Registration error:", authError.message);
            return json({ error: `Registration failed: ${authError.message}` }, { status: 400 });
        }

        if (!authData.user?.id) {
            console.error("No user ID returned after signup.");
            return json({ error: "Failed to retrieve user ID during signup." }, { status: 500 });
        }

        const userId = authData.user.id;

        const { data: userInsertData, error: userInsertError } = await supabase
            .from('users')
            .insert({
                id: userId,
                email,
                name,
                surname,
                gender,
                role: 'user',
            });

        if (userInsertError) {
            console.error("Error inserting user data into `users` table:", userInsertError.message);

            await supabase.auth.admin.deleteUser(userId);

            return json({ error: `Failed to save user details: ${userInsertError.message}` }, { status: 400 });
        }

        console.log("User successfully added to the `users` table:", userInsertData);

        return json({ success: true, message: "User registered successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Unexpected server error:", error);
        return json({ error: "An unexpected error occurred during registration." }, { status: 500 });
    }
};
