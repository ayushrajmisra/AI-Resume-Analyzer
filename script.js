// Navbar Toggle for Mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Password Visibility Toggle
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.nextElementSibling.querySelector('i');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Form Validation (Login & Signup)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const contactForm = document.querySelector('.contact-form'); // Assuming this is the form element

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateLoginForm();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateSignupForm();
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitContactForm();
        });
    }
});

// Function to submit the contact form
function submitContactForm() {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');

    let isValid = true; // Basic client-side validation for contact form

    if (!nameField.value || !emailField.value || !messageField.value) {
        alert('Please fill in all fields.');
        isValid = false;
    } else if (!isValidEmail(emailField.value)) {
        alert('Please enter a valid email address.');
        isValid = false;
    }

    if (isValid) {
        fetch('http://127.0.0.1:5000/api/contact', { // IMPORTANT: Use the full backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameField.value,
                email: emailField.value,
                message: messageField.value
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                // Clear form fields on success
                nameField.value = '';
                emailField.value = '';
                messageField.value = '';
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        });
    }
}

function validateLoginForm() {
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');

    let isValid = true;

    // Reset errors
    emailError.textContent = '';
    passwordError.textContent = '';

    // Email validation
    if (!emailField.value) {
        emailError.textContent = 'Email is required.';
        isValid = false;
    } else if (!isValidEmail(emailField.value)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Password validation
    if (!passwordField.value) {
        passwordError.textContent = 'Password is required.';
        isValid = false;
    }

    if (isValid) {
        // Send data to backend
        fetch('http://127.0.0.1:5000/api/login', { // IMPORTANT: Use the full backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                // Redirect or update UI on successful login
                // window.location.href = 'dashboard.html'; // Example redirect
            } else if (data.error) {
                // Display specific error messages from backend
                if (data.error.includes("email")) {
                    emailError.textContent = data.error;
                } else if (data.error.includes("password")) {
                    passwordError.textContent = data.error;
                } else {
                    alert(data.error); // General error
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    }
}

function validateSignupForm() {
    const emailField = document.getElementById('signupEmail');
    const passwordField = document.getElementById('signupPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const emailError = document.getElementById('signupEmailError');
    const passwordError = document.getElementById('signupPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    let isValid = true;

    // Reset errors
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    // Email validation
    if (!emailField.value) {
        emailError.textContent = 'Email is required.';
        isValid = false;
    } else if (!isValidEmail(emailField.value)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Password validation (client-side first)
    const passwordValidationResult = isValidPassword(passwordField.value);
    if (passwordValidationResult !== true) {
        passwordError.textContent = passwordValidationResult;
        isValid = false;
    }

    // Confirm Password validation
    if (!confirmPasswordField.value) {
        confirmPasswordError.textContent = 'Please confirm your password.';
        isValid = false;
    } else if (passwordField.value !== confirmPasswordField.value) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
    }

    if (isValid) {
        // Send data to backend
        fetch('http://127.0.0.1:5000/api/signup', { // IMPORTANT: Use the full backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                window.location.href = 'login.html'; // Redirect to login page
            } else if (data.error) {
                // Display specific error messages from backend
                if (data.error.includes("email")) {
                    emailError.textContent = data.error;
                } else if (data.error.includes("password")) {
                    passwordError.textContent = data.error;
                } else {
                    alert(data.error); // General error
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during signup. Please try again later.');
        });
    }
}


function isValidEmail(email) {
    // Basic email regex for client-side validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character.';
    }
    return true; // Password is valid
}


