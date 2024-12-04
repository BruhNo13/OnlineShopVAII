<script lang="ts">

    let email = '';
    let password = '';
    let name = '';
    let surname = '';
    let gender = '';
    let role = '';
    let showPassword = false;
    let message = '';
    let isFormValid = false;

    let emailError = '';
    let passwordError = '';
    let nameError = '';
    let surnameError = '';
    let genderError = '';

    let emailTouched = false;
    let passwordTouched = false;
    let nameTouched = false;
    let surnameTouched = false;
    let genderTouched = false;

    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError = 'Enter a valid email address!';
            return false;
        }
        emailError = '';
        return true;
    }

    function validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            passwordError = 'Password must have at least 8 characters, one uppercase letter, one number, and one special character.';
            return false;
        }
        passwordError = '';
        return true;
    }

    function validateName(name: string): boolean {
        const nameRegex = /^[A-Za-zÀ-ž\s-]{2,}$/;
        if (!nameRegex.test(name)) {
            nameError = 'Name must have at least 2 characters and contain only letters, spaces, and dashes.';
            return false;
        }
        nameError = '';
        return true;
    }

    function validateSurname(surname: string): boolean {
        const surnameRegex = /^[A-Za-zÀ-ž\s-]{2,}$/;
        if (!surnameRegex.test(surname)) {
            surnameError = 'Surname must have at least 2 characters and contain only letters, spaces, and dashes.';
            return false;
        }
        surnameError = '';
        return true;
    }

    function validateGender(gender: string): boolean {
        if (!['male', 'female', 'other'].includes(gender)) {
            genderError = 'Select a gender!';
            return false;
        }
        genderError = '';
        return true;
    }

    function validateForm(): boolean {
        return (
            validateEmail(email) &&
            validatePassword(password) &&
            validateName(name) &&
            validateSurname(surname) &&
            validateGender(gender)
        );
    }

    function handleBlur(field: 'email' | 'password' | 'name' | 'surname' | 'gender') {
        if (field === 'email') {
            emailTouched = true;
            validateEmail(email);
        } else if (field === 'password') {
            passwordTouched = true;
            validatePassword(password);
        } else if (field === 'name') {
            nameTouched = true;
            validateName(name);
        } else if (field === 'surname') {
            surnameTouched = true;
            validateSurname(surname);
        } else if (field === 'gender') {
            genderTouched = true;
            validateGender(gender);
        }

        isFormValid = validateForm();
    }

    async function register() {
        try {

            const userData = {
                email,
                password,
                name,
                surname,
                gender,
            };

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Registration error:", result.error);
                message = `Registration failed: ${result.error}`;
                return;
            }

            console.log("Registration successful:", result.message);
            message = "Successfully registered! Redirecting...";
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            console.error("Unexpected registration error:", error);
            message = "An unexpected error occurred during registration.";
        }
    }

</script>


<div class="signup-container">
    <header class="signup-header">
        <h1>FAKESHEIN</h1>
    </header>

    <form on:submit|preventDefault={register} class="signup-form">
        <!-- Name -->
        <div class="form-group {nameError ? 'error' : ''}">
            <label for="name">Name</label>
            <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    bind:value={name}
                    on:blur={() => handleBlur('name')}
                    required
            />
            {#if nameTouched && nameError}
                <p class="error-message">{nameError}</p>
            {/if}
        </div>

        <!-- Surname -->
        <div class="form-group {surnameError ? 'error' : ''}">
            <label for="surname">Surname</label>
            <input
                    type="text"
                    id="surname"
                    placeholder="Enter your surname"
                    bind:value={surname}
                    on:blur={() => handleBlur('surname')}
                    required
            />
            {#if surnameTouched && surnameError}
                <p class="error-message">{surnameError}</p>
            {/if}
        </div>

        <!-- Gender -->
        <div class="form-group {genderError ? 'error' : ''}">
            <label for="gender">Gender</label>
            <select id="gender" bind:value={gender} on:blur={() => handleBlur('gender')} required>
                <option value="" disabled selected>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            {#if genderTouched && genderError}
                <p class="error-message">{genderError}</p>
            {/if}
        </div>

        <!-- Email -->
        <div class="form-group {emailError ? 'error' : ''}">
            <label for="email">E-mail</label>
            <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    on:blur={() => handleBlur('email')}
                    required
            />
            {#if emailTouched && emailError}
                <p class="error-message">{emailError}</p>
            {/if}
        </div>

        <!-- Password -->
        <div class="form-group password-group {passwordError ? 'error' : ''}">
            <label for="password">Password</label>
            <div class="password-container">
                <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter your password"
                        bind:value={password}
                        on:blur={() => handleBlur('password')}
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

        <!-- Submit Button -->
        <button type="submit" class="signup-button" disabled={!isFormValid}>Register</button>
    </form>

    <footer class="signup-footer">
        <p>Already have an account? <a href="/login">Log in</a></p>
    </footer>
</div>

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
