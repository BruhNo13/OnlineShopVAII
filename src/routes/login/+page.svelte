<script lang="ts">
import { z } from "zod";
    let email = '';
    let password = '';
    let message = '';
    let showPassword = false;
    let isFormValid = false;

    let emailError = '';
    let passwordError = '';

    let emailTouched = false;
    let passwordTouched = false;

    let errors = { email: '', password: '' };

    const loginSchema = z.object({
        email: z.string().email('Enter a valid email address!'),
        password: z
            .string()
            .min(8, 'Password must have at least 8 characters.')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/\d/, 'Password must contain at least one number.')
            .regex(/[@$!%*?&]/, 'Password must contain at least one special character.'),
    });

    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }

    const validateForm = () => {
        const result = loginSchema.safeParse({ email, password });

        if (result.success) {
            errors = { email: '', password: '' };
            isFormValid = true;
        } else {
            errors = { email: '', password: '' };
            result.error.errors.forEach((err) => {
                const key = err.path[0];
                if (typeof key === 'string' && key in errors) {
                    errors[key as keyof typeof errors] = err.message;
                }
            });
            isFormValid = false;
        }
    };

    const handleBlur = (field: 'email' | 'password') => {
        if (field === 'email') {
            emailTouched = true;
        } else if (field === 'password') {
            passwordTouched = true;
        }
        validateForm();
    }

    const handleInput = (field: 'email' | 'password') => {
        if ((field === 'email' && emailTouched) || (field === 'password' && passwordTouched)) {
            validateForm();
        }
    };

    async function login() {
        validateForm();
        if (!isFormValid) return;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (!result.success) {
            message = result.message;
            return;
        }

        window.location.href = '/';
    }

</script>

<div class="login-container">
    <header class="login-header">
        <h1>FAKESHEIN</h1>
    </header>

    <form on:submit|preventDefault={login} class="login-form">
        <div class="form-group {emailError ? 'error' : ''}">
            <label for="email">E-mail</label>
            <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    on:blur={() => handleBlur('email')}
                    on:input={() => handleInput('email')}
                    required
            />
            {#if emailTouched && emailError}
                <p class="error-message">{emailError}</p>
            {/if}
        </div>

        <div class="form-group password-group {passwordError ? 'error' : ''}">
            <label for="password">Password</label>
            <div class="password-container">
                <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter your password"
                        bind:value={password}
                        on:blur={() => handleBlur('password')}
                        on:input={() => handleInput('password')}
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
            {#if passwordTouched && passwordError}
                <p class="error-message">{passwordError}</p>
            {/if}
        </div>

        <button type="submit" class="login-button" disabled={!isFormValid}>Log In</button>
    </form>

    <footer class="login-footer">
        <p>New user? <a href="/signup" class="signup-link">Sign up</a></p>
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

    .login-footer .signup-link {
        color: #007bff;
        text-decoration: none;
    }

    .login-footer .signup-link:hover {
        text-decoration: underline;
    }
    .error-message {
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
</style>
