<script lang="ts">
    import { z } from "zod";

    let email = '';
    let password = '';
    let name = '';
    let surname = '';
    let gender = '';
    let showPassword = false;
    let message = '';
    let errors: Record<string, string> = {};
    let isFormValid = true;

    const signupSchema = z.object({
        email: z.string().email("Enter a valid email address!"),
        password: z
            .string()
            .min(8, "Password must have at least 8 characters.")
            .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
            .regex(/\d/, "Password must include at least one number.")
            .regex(/[@$!%*?&]/, "Password must include at least one special character."),
        name: z
            .string()
            .min(2, "Name must have at least 2 characters.")
            .regex(/^[A-Za-zÀ-ž\s-]+$/, "Name must contain only letters, spaces, and dashes."),
        surname: z
            .string()
            .min(2, "Surname must have at least 2 characters.")
            .regex(/^[A-Za-zÀ-ž\s-]+$/, "Surname must contain only letters, spaces, and dashes."),
        gender: z.enum(["male", "female", "other"]),
    });

    const validateForm = () => {
        try {
            signupSchema.parse({ email, password, name, surname, gender });
            errors = {};
            isFormValid = true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                errors = {};
                err.errors.forEach((e) => {
                    if (e.path[0]) errors[e.path[0]] = e.message;
                });
                isFormValid = false;
            }
        }
    };

    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }

    async function signup() {
        validateForm();

        if (!isFormValid) {
            message = "Please fix the errors before submitting.";
            return;
        }

        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, surname, gender }),
        });

        const result = await response.json();

        if (!result.success) {
            message = result.message;
            return;
        }

        window.location.href = '/';
    }
</script>

<main class="signup-container">
    <header class="signup-header">
        <h1>FAKESHEIN</h1>
    </header>

    <form on:submit|preventDefault={signup} class="signup-form">
        <div class="form-group {errors.name ? 'error' : ''}">
            <label for="name">Name</label>
            <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    bind:value={name}
            />
            <p class="error-message">{errors.name}</p>

        </div>

        <div class="form-group {errors.surname ? 'error' : ''}">
            <label for="surname">Surname</label>
            <input
                    type="text"
                    id="surname"
                    placeholder="Enter your surname"
                    bind:value={surname}
            />
            <p class="error-message">{errors.surname}</p>

        </div>

        <div class="form-group {errors.gender ? 'error' : ''}">
            <label for="gender">Gender</label>
            <select id="gender" bind:value={gender}>
                <option value="" disabled>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <p class="error-message">{errors.gender}</p>

        </div>

        <div class="form-group {errors.email ? 'error' : ''}">
            <label for="email">E-mail</label>
            <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    bind:value={email}
            />
            <p class="error-message">{errors.email}</p>

        </div>

        <div class="form-group {errors.password ? 'error' : ''}">
            <label for="password">Password</label>
            <div class="password-container">
                <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter your password"
                        bind:value={password}
                />
                <button
                        type="button"
                        class="toggle-password"
                        on:click={togglePasswordVisibility}
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
            </div>
            <p class="error-message">{errors.password}</p>

        </div>

        <button type="submit" class="signup-button">Register</button>
    </form>

    <footer class="signup-footer">
        <p>Already have an account? <a href="/login">Log in</a></p>
    </footer>
</main>


<p>{message}</p>

<style>
    .signup-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    .signup-header {
        background-color: #222;
        color: white;
        padding: 1rem 0;
        margin-bottom: 2rem;
    }

    .signup-header h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    .signup-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
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

    .signup-button {
        background-color: #000;
        color: white;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .signup-button:hover {
        background-color: #333;
    }

    .signup-footer {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #555;
    }

    .signup-footer a {
        color: #007bff;
        text-decoration: none;
    }

    .signup-footer a:hover {
        text-decoration: underline;
    }

    .form-group select {
        width: 100%;
        padding: 1.2rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        background-color: white;
        color: #333;
    }
    .form-group.error input {
        border-color: red;
    }

    .error-message {
        color: red;
        font-size: 0.8rem;
        margin-top: 0.2rem;
    }
    .signup-button:disabled {
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>
