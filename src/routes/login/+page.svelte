<script lang="ts">
    import { supabase } from '../../lib/supabase.js';

    let email = '';
    let password = '';
    let message = '';
    let showPassword = false;
    let userName = '';
    let isAdmin = false;

    // Toggle password visibility
    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }

    // Login function
    async function login() {
        try {
            const { data: user, error } = await supabase.auth.signInWithPassword({email, password});

            if (error || !user) {
                message = 'Nesprávny e-mail alebo heslo.';
                return;
            }

            // Store user data
            // userName = user.name;
            // isAdmin = user.is_admin;

            // Redirect to main page
            window.location.href = `/`;
        } catch (err) {
            console.error('Došlo k neočakávanej chybe.', err);
            message = 'Došlo k neočakávanej chybe.';
        }
    }
</script>

<div class="login-container">
    <header class="login-header">
        <h1>FAKESHEIN</h1>
    </header>

    <form on:submit|preventDefault={login} class="login-form">
        <div class="form-group">
            <label for="email">E-mail</label>
            <input
                    type="email"
                    id="email"
                    placeholder="Zadajte svoj e-mail"
                    bind:value={email}
                    required
            />
        </div>

        <div class="form-group password-group">
            <label for="password">Heslo</label>
            <div class="password-container">
                <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Zadajte heslo"
                        bind:value={password}
                        required
                />
                <button
                        type="button"
                        class="toggle-password"
                        on:click={togglePasswordVisibility}
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
            </div>
        </div>

        <button type="submit" class="login-button">Prihlásiť</button>
    </form>

    <footer class="login-footer">
        <a href="/forgot-password" class="forgot-password">Zabudnuté heslo?</a>
        <hr />
        <p>Nový používateľ? <a href="/signup" class="signup-link">Registrovať sa</a></p>
    </footer>
</div>

<p>{message}</p>

<style>
    .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    .login-header {
        background-color: #222;
        color: white;
        padding: 1rem 0;
        margin-bottom: 2rem;
    }

    .login-header h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .form-group label {
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    .form-group input {
        height: 2.5rem;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .password-group {
        position: relative;
    }

    .password-container {
        display: flex;
        align-items: center;
    }

    .password-container input {
        flex-grow: 1;
    }

    .toggle-password {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: 0.5rem;
        font-size: 1.2rem;
        color: #555;
    }

    .toggle-password:hover {
        color: #000;
    }

    .login-button {
        background-color: #000;
        color: white;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .login-button:hover {
        background-color: #333;
    }

    .login-footer {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #555;
    }

    .login-footer .forgot-password {
        color: #007bff;
        text-decoration: none;
    }

    .login-footer .forgot-password:hover {
        text-decoration: underline;
    }

    .login-footer hr {
        margin: 1rem 0;
        border: none;
        border-top: 1px solid #ddd;
    }

    .login-footer .signup-link {
        color: #007bff;
        text-decoration: none;
    }

    .login-footer .signup-link:hover {
        text-decoration: underline;
    }
</style>
