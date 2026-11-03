
/* =========================================
   AUTHFLOW - LOGIN AUTHENTICATION SYSTEM
   Complete JavaScript Functionality
========================================= */


/* =========================================
   1. DOM ELEMENTS
========================================= */

// Authentication containers
const authContainer = document.getElementById("auth-container");
const dashboardContainer = document.getElementById("dashboard-container");

// Authentication views
const loginView = document.getElementById("login-view");
const signupView = document.getElementById("signup-view");
const forgotView = document.getElementById("forgot-view");

// Forms
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const forgotForm = document.getElementById("forgot-form");

// Login inputs
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const rememberMe = document.getElementById("remember-me");

// Signup inputs
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const confirmPassword = document.getElementById("confirm-password");
const termsCheckbox = document.getElementById("terms-checkbox");

// Password strength
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");

// Forgot password
const forgotEmail = document.getElementById("forgot-email");

// Navigation buttons
const showSignupBtn = document.getElementById("show-signup");
const showLoginBtn = document.getElementById("show-login");
const forgotPasswordBtn = document.getElementById("forgot-password-link");
const backToLoginBtn = document.getElementById("back-to-login");

// Dashboard
const logoutButton = document.getElementById("logout-button");
const userAvatar = document.getElementById("user-avatar");
const dashboardUserName = document.getElementById("dashboard-user-name");
const welcomeName = document.getElementById("welcome-name");

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");

const accountName = document.getElementById("account-name");
const accountEmail = document.getElementById("account-email");

// Toast notification
const toast = document.getElementById("toast");
const toastIcon = document.getElementById("toast-icon");
const toastMessage = document.getElementById("toast-message");


/* =========================================
   2. APPLICATION DATA
========================================= */

const USERS_KEY = "authflow_users";

const SESSION_KEY = "authflow_session";
const REMEMBER_KEY = "authflow_remembered_session";

let users = [];

// Load registered users from Local Storage
function loadUsers() {
    try {
        const savedUsers = localStorage.getItem(USERS_KEY);
        const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];

        users = Array.isArray(parsedUsers) ? parsedUsers : [];

    } catch (error) {
        console.error("Unable to load users:", error);
        users = [];
    }
}

loadUsers();


/* =========================================
   3. STORAGE FUNCTIONS
========================================= */

// Save users in Local Storage
function saveUsers() {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


// Get active session
function getActiveSession() {
    return (
        sessionStorage.getItem(SESSION_KEY) ||
        localStorage.getItem(REMEMBER_KEY)
    );
}


// Save login session
function saveSession(email, remember) {

    // Remove previous sessions
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);

    if (remember) {

        // Persistent session
        localStorage.setItem(REMEMBER_KEY, email);

    } else {

        // Session ends when browser tab/session ends
        sessionStorage.setItem(SESSION_KEY, email);
    }
}


// Clear session during logout
function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
}


/* =========================================
   4. PASSWORD HASHING
========================================= */

// SHA-256 password hashing using Web Crypto API
// Works on HTTPS or localhost

async function hashPassword(password) {

    if (!window.crypto || !window.crypto.subtle) {
        throw new Error(
            "Secure password hashing is unavailable."
        );
    }

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


/* =========================================
   5. TOAST NOTIFICATIONS
========================================= */

let toastTimer;

function showToast(message, type = "success") {

    if (!toast || !toastMessage || !toastIcon) return;

    clearTimeout(toastTimer);

    toastMessage.textContent = message;

    toast.classList.remove("error");

    if (type === "error") {

        toast.classList.add("error");
        toastIcon.textContent = "!";

    } else {

        toastIcon.textContent = "✓";
    }

    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =========================================
   6. FORM VALIDATION HELPERS
========================================= */

// Clear validation errors
function clearErrors(form) {

    if (!form) return;

    form.querySelectorAll(".error-message").forEach(error => {
        error.textContent = "";
    });

    form.querySelectorAll("input").forEach(input => {
        input.classList.remove("input-error");
    });
}


// Display field error
function showFieldError(input, errorId, message) {

    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (input) {
        input.classList.add("input-error");
    }
}


/* =========================================
   7. VIEW NAVIGATION
========================================= */

function showView(view) {

    const views = [
        loginView,
        signupView,
        forgotView
    ];

    views.forEach(item => {
        if (item) {
            item.classList.remove("active");
        }
    });

    if (view) {
        view.classList.add("active");
    }

    clearErrors(loginForm);
    clearErrors(signupForm);
    clearErrors(forgotForm);
}


// Open registration page
showSignupBtn.addEventListener("click", () => {
    showView(signupView);
});


// Open login page
showLoginBtn.addEventListener("click", () => {
    showView(loginView);
});


// Open forgot password page
forgotPasswordBtn.addEventListener("click", () => {
    showView(forgotView);
});


// Return to login page
backToLoginBtn.addEventListener("click", () => {
    showView(loginView);
});


/* =========================================
   8. EMAIL VALIDATION
========================================= */

function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/* =========================================
   9. PASSWORD VALIDATION
========================================= */

// Internship requirements:
// 1. Minimum 8 characters
// 2. At least one number

function isStrongPassword(password) {

    const hasMinimumLength = password.length >= 8;

    const hasNumber = /[0-9]/.test(password);

    return hasMinimumLength && hasNumber;
}


/* =========================================
   10. PASSWORD STRENGTH INDICATOR
========================================= */

function checkPasswordStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[a-z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;


    const strengthLevels = [

        {
            width: "0%",
            text: "Password strength",
            color: "transparent"
        },

        {
            width: "20%",
            text: "Very Weak",
            color: "#e85d6b"
        },

        {
            width: "40%",
            text: "Weak",
            color: "#f08b50"
        },

        {
            width: "60%",
            text: "Medium",
            color: "#efa83d"
        },

        {
            width: "80%",
            text: "Strong",
            color: "#21ad7b"
        },

        {
            width: "100%",
            text: "Very Strong",
            color: "#159b6c"
        }
    ];

    const level = strengthLevels[score];

    strengthFill.style.width = level.width;
    strengthFill.style.backgroundColor = level.color;

    strengthText.textContent = level.text;
}


// Update strength while typing
signupPassword.addEventListener("input", () => {
    checkPasswordStrength(signupPassword.value);
});


/* =========================================
   11. PASSWORD VISIBILITY TOGGLE
========================================= */

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        if (!input) return;

        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        button.textContent = isPassword ? "Hide" : "Show";

        button.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );
    });
});


/* =========================================
   12. USER REGISTRATION
========================================= */

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors(signupForm);

    const name = signupName.value.trim();

    const email = signupEmail.value.trim().toLowerCase();

    const password = signupPassword.value;

    const confirm = confirmPassword.value;

    let isValid = true;


    // Name validation
    if (name.length < 2) {

        showFieldError(
            signupName,
            "signup-name-error",
            "Name must contain at least 2 characters."
        );

        isValid = false;
    }


    // Email validation
    if (!isValidEmail(email)) {

        showFieldError(
            signupEmail,
            "signup-email-error",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // Password validation
    if (!isStrongPassword(password)) {

        showFieldError(
            signupPassword,
            "signup-password-error",
            "Password must contain at least 8 characters and 1 number."
        );

        isValid = false;
    }


    // Confirm password validation
    if (password !== confirm) {

        showFieldError(
            confirmPassword,
            "confirm-password-error",
            "Passwords do not match."
        );

        isValid = false;
    }


    // Terms and conditions validation
    if (!termsCheckbox.checked) {

        showToast(
            "Please accept the Terms and Conditions.",
            "error"
        );

        isValid = false;
    }


    if (!isValid) return;


    // Duplicate email detection
    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {

        showFieldError(
            signupEmail,
            "signup-email-error",
            "An account with this email already exists."
        );

        return;
    }


    try {

        // Hash password before storing it
        const passwordHash = await hashPassword(password);


        // Create new user
        const newUser = {

            id: window.crypto.randomUUID
                ? window.crypto.randomUUID()
                : Date.now().toString(),

            name: name,

            email: email,

            passwordHash: passwordHash,

            createdAt: new Date().toISOString()
        };


        // Add user to application data
        users.push(newUser);

        // Save user in Local Storage
        saveUsers();


        // Reset registration form
        signupForm.reset();

        checkPasswordStrength("");


        // Navigate to login page
        showView(loginView);

        // Automatically fill registered email
        loginEmail.value = email;

        showToast(
            "Account created successfully! Please sign in."
        );

    } catch (error) {

        console.error("Registration error:", error);

        // Remove unsaved user if storage failed
        users = users.filter(user => user.email !== email);

        showToast(
            "Unable to create account. Please try again.",
            "error"
        );
    }
});


/* =========================================
   13. USER LOGIN
========================================= */

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors(loginForm);

    const email = loginEmail.value.trim().toLowerCase();

    const password = loginPassword.value;


    // Basic input validation
    let isValid = true;

    if (!isValidEmail(email)) {

        showFieldError(
            loginEmail,
            "login-email-error",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    if (!password) {

        showFieldError(
            loginPassword,
            "login-password-error",
            "Please enter your password."
        );

        isValid = false;
    }


    if (!isValid) return;


    try {

        // Find registered user
        const user = users.find(
            item => item.email === email
        );


        // Generic error for unknown email
        if (!user) {

            showToast(
                "Invalid email or password. Please try again.",
                "error"
            );

            return;
        }


        // Hash entered password
        const enteredHash = await hashPassword(password);


        // Generic error for incorrect password
        if (enteredHash !== user.passwordHash) {

            showToast(
                "Invalid email or password. Please try again.",
                "error"
            );

            return;
        }


        // Create login session
        saveSession(email, rememberMe.checked);


        // Reset login form
        loginForm.reset();


        // Open dashboard
        openDashboard(user);


        showToast("Login successful! Welcome back.");

    } catch (error) {

        console.error("Login error:", error);

        showToast(
            "Unable to login. Please try again.",
            "error"
        );
    }
});


/* =========================================
   14. DASHBOARD
========================================= */

function openDashboard(user) {

    if (!user) return;


    // Hide authentication panel
    authContainer.style.display = "none";


    // Show dashboard
    dashboardContainer.classList.add("active");


    // Get first name
    const firstName = user.name.split(" ")[0];


    // Update dashboard information
    dashboardUserName.textContent = firstName;

    welcomeName.textContent = firstName;

    userAvatar.textContent = firstName.charAt(0).toUpperCase();


    // Profile information
    profileName.textContent = user.name;

    profileEmail.textContent = user.email;


    // Account information
    accountName.textContent = user.name;

    accountEmail.textContent = user.email;
}


/* =========================================
   15. LOGOUT
========================================= */

logoutButton.addEventListener("click", function () {

    // Clear active session
    clearSession();


    // Hide dashboard
    dashboardContainer.classList.remove("active");


    // Show authentication panel
    authContainer.style.display = "grid";


    // Reset login form
    loginForm.reset();

    showView(loginView);


    showToast("You have been logged out successfully.");
});


/* =========================================
   16. FORGOT PASSWORD DEMO
========================================= */

forgotForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors(forgotForm);

    const email = forgotEmail.value.trim().toLowerCase();


    // Validate email
    if (!isValidEmail(email)) {

        showFieldError(
            forgotEmail,
            "forgot-email-error",
            "Please enter a valid email address."
        );

        return;
    }


    // Check whether account exists
    const userExists = users.some(
        user => user.email === email
    );


    if (userExists) {

        showToast(
            "Account found. Real password reset requires a backend and email service."
        );

    } else {

        // Do not reveal whether account exists
        showToast(
            "If an account exists, password recovery can be arranged through the backend."
        );
    }


    forgotForm.reset();
});


/* =========================================
   17. SESSION RESTORATION
========================================= */

function restoreSession() {

    const activeEmail = getActiveSession();


    // No active session
    if (!activeEmail) {

        authContainer.style.display = "grid";

        dashboardContainer.classList.remove("active");

        return;
    }


    // Find user associated with session
    const user = users.find(
        item => item.email === activeEmail
    );


    if (user) {

        // Restore dashboard
        openDashboard(user);

    } else {

        // Invalid session
        clearSession();

        authContainer.style.display = "grid";

        dashboardContainer.classList.remove("active");
    }
}


/* =========================================
   18. INITIALIZE APPLICATION
========================================= */

function initializeApp() {

    // Show login screen by default
    authContainer.style.display = "grid";

    dashboardContainer.classList.remove("active");


    // Restore existing session if available
    restoreSession();


    // Initialize password strength indicator
    checkPasswordStrength("");
}


// Start application
initializeApp();


/* =========================================
   AUTHFLOW APPLICATION INITIALIZED
========================================= */
