<script lang="ts">
    import { supabase } from '../../lib/supabase.js';
    let email = '';
    let password = '';
    let name = '';
    let surname = '';
    let gender = '';
    let showPassword = false;
    let message = '';

    // Funkcia na zmenu viditeľnosti hesla
    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }

    async function register() {
        try {
            // Sign up the user using Supabase Auth
            const { data:authData, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (!error && authData.user != null)  {
                const { data:myData, error } = await supabase.from('users').insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    name,
                    surname,
                    gender,
                });
                console.log(gender);
                if (error) {
                    console.log(error.message);
                }
            }
            if (error) {
                console.error(error);
                message = 'Chyba pri registrácii: ' + error.message;
            } else {
                message = 'Úspešne zaregistrovaný! Skontrolujte svoj e-mail na potvrdenie.';
                window.location.href = `/`;
            }
        } catch (err) {
            console.error(err);
            message = 'Došlo k neočakávanej chybe.';
        }
    }

</script>

<div class="signup-container">
    <header class="signup-header">
        <h1>FAKESHEIN</h1>
    </header>

    <form on:submit={register} class="signup-form">
        <div class="form-group">
            <label for="firstName">Meno</label>
            <input
                    type="text"
                    id="firstName"
                    placeholder="Zadajte svoje meno"
                    bind:value={name}
                    required
            />
        </div>

        <div class="form-group">
            <label for="lastName">Priezvisko</label>
            <input
                    type="text"
                    id="lastName"
                    placeholder="Zadajte svoje priezvisko"
                    bind:value={surname}
                    required
            />
        </div>

        <div class="form-group">
            <label for="gender">Gender</label>
            <select id="gender" bind:value={gender} required>
                <option value="" disabled selected>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>

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

        <button type="submit" class="signup-button">Registrovať</button>
    </form>

    <footer class="signup-footer">
        <p>Už máte účet? <a href="/login">Prihlásiť sa</a></p>
    </footer>
</div>

<p>{message}</p>

<style>
    /* Štýly zostávajú rovnaké, ako v pôvodnom kóde */
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
</style>
