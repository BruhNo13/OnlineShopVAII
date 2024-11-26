<script>
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
    let showPassword = false;

    const togglePasswordVisibility = () => {
        showPassword = !showPassword;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        alert('Sign-up form submitted!');
    };

</script>

<p>Check the console to verify environment variables.</p>

<div class="signup-container">
    <header class="signup-header">
        <h1>FAKESHEIN</h1>
    </header>

    <form on:submit={handleSubmit} class="signup-form">
        <div class="form-group">
            <label for="firstName">Name</label>
            <input type="text" id="firstName" placeholder="Enter your first name" required />
        </div>

        <div class="form-group">
            <label for="lastName">Last name</label>
            <input type="text" id="lastName" placeholder="Enter your last name" required />
        </div>

        <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" placeholder="Enter email" required />
        </div>

        <div class="form-group password-group">
            <label for="password">Password</label>
            <div class="password-container">
                <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        required
                />
                <button type="button" class="toggle-password" on:click={togglePasswordVisibility}>
                    {showPassword ? '🙈' : '👁️'}
                </button>
            </div>
        </div>

        <button type="submit" class="signup-button">Sign Up</button>
    </form>

    <footer class="signup-footer">
        <p>Already Signed In? <a href="/login">Log In</a></p>
    </footer>
</div>

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
</style>
