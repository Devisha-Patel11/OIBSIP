/* =========================================
   AUTHFLOW - AUTHENTICATION SYSTEM
   Complete JavaScript Functionality
========================================= */


/* ---------- DOM ELEMENTS ---------- */

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


/* ---------- APPLICATION DATA ---------- */

// Users are stored in Local Storage.
// Passwords are stored as SHA-256 hashes, not plaintext.

const USERS_KEY = "authflow_users";

let users = [];

try {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];

    users = Array.isArray(parsedUsers) ? parsedUsers : [];

} catch (error) {
    console.error("Unable to load users:", error);
    users = [];
}


/* ---------- STORAGE FUNCTIONS ---------- */

function saveUsers() {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


function getActiveSession() {

    return (
        sessionStorage.getItem("authflow_session") ||
        localStorage.getItem("authflow_remembered_session")
    );

}


function saveSession(email, remember) {

    // Clear any old session first.

    sessionStorage.removeItem("authflow_session");

    localStorage.removeItem("authflow_remembered_session");

    if (remember) {

        localStorage.setItem(
            "authflow_remembered_session",
            email
        );

    } else {

        sessionStorage.setItem(
            "authflow_session",
            email
        );

    }

}


function clearSession() {

    sessionStorage.removeItem("authflow_session");

    localStorage.removeItem("authflow_remembered_session");

}


/* ---------- PASSWORD HASHING ---------- */

// Uses Web Crypto API.
// Requires HTTPS or localhost.

async function hashPassword(password) {

    if (!window.crypto || !window.crypto.subtle) {

        throw new Error(
            "Secure password hashing is unavailable in this browser context."
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


/* ---------- TOAST NOTIFICATIONS ---------- */

let toastTimer;

function showToast(message, type = "success") {

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


/* ---------- CLEAR VALIDATION ERRORS ---------- */

function clearErrors(form) {

    form.querySelectorAll(".error-message").forEach(error => {

        error.textContent = "";

    });

    form.querySelectorAll("input").forEach(input => {

        input.classList.remove("input-error");

    });

}


function showFieldError(input, errorId, message) {

    const errorElement = document.getElementById(errorId);

    if (errorElement) {

        errorElement.textContent = message;

    }

    input.classList.add("input-error");

}


/* ---------- VIEW NAVIGATION ---------- */

function showView(view) {

    const views = [
        loginView,
        signupView,
        forgotView
    ];

    views.forEach(item => {

        item.classList.remove("active");

    });

    view.classList.add("active");

    clearErrors(loginForm);
    clearErrors(signupForm);
    clearErrors(forgotForm);

}


showSignupBtn.addEventListener("click", () => {

    showView(signupView);

});


showLoginBtn.addEventListener("click", () => {

    showView(loginView);

});


forgotPasswordBtn.addEventListener("click", () => {

    showView(forgotView);

});


backToLoginBtn.addEventListener("click", () => {

    showView(loginView);

});


/* ---------- EMAIL VALIDATION ---------- */

function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* ---------- PASSWORD VALIDATION ---------- */

function isStrongPassword(password) {

    const hasMinimumLength = password.length >= 8;

    const hasUppercase = /[A-Z]/.test(password);

    const hasLowercase = /[a-z]/.test(password);

    const hasNumber = /[0-9]/.test(password);

    return (
        hasMinimumLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
    );

}


/* ---------- PASSWORD STRENGTH ---------- */

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


signupPassword.addEventListener("input", () => {

    checkPasswordStrength(signupPassword.value);

});


/* ---------- PASSWORD VISIBILITY ---------- */

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
   USER REGISTRATION
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
            "Use at least 8 characters, including uppercase, lowercase and a number."
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


    // Terms validation

    if (!termsCheckbox.checked) {

        showToast(
            "Please accept the Terms and Conditions.",
            "error"
        );

        isValid = false;

    }


    if (!isValid) return;


    // Duplicate account detection

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

        // Hash password before saving.

        const passwordHash = await hashPassword(password);


        const newUser = {

            id: crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(),

            name: name,

            email: email,

            passwordHash: passwordHash,

            createdAt: new Date().toISOString()

        };


        users.push(newUser);

        saveUsers();


        // Reset registration form.

        signupForm.reset();

        checkPasswordStrength("");

        showView(loginView);


        // Fill login email automatically.

        loginEmail.value = email;

        showToast(
            "Account created successfully! Please sign in."
        );


    } catch (error) {

        console.error("Registration error:", error);

        showToast(
            "Unable to create account. Please try again.",
            "error"
        );

    }

});


/* =========================================
   USER LOGIN
========================================= */

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors(loginForm);


    const email = loginEmail.value.trim().toLowerCase();

    const password = loginPassword.value;


    let isValid = true;


    // Email validation

    if (!isValidEmail(email)) {

        showFieldError(
            loginEmail,
            "login-email-error",
            "Please enter a valid email address."
        );

        isValid = false;

    }


    // Password validation

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

        // Find registered user.

        const user = users.find(
            item => item.email === email
        );


        if (!user) {

            showFieldError(
                loginEmail,
                "login-email-error",
                "No account found with this email."
            );

            return;

        }


        // Compare password hashes.

        const enteredHash = await hashPassword(password);


        if (enteredHash !== user.passwordHash) {

            showFieldError(
                loginPassword,
                "login-password-error",
                "Incorrect password. Please try again."
            );

            return;

        }


        // Create session.

        saveSession(email, rememberMe.checked);


        // Reset login form.

        loginForm.reset();


        // Open dashboard.

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
   DASHBOARD
========================================= */

function openDashboard(user) {

    if (!user) return;


    // Hide authentication panel.

    authContainer.style.display = "none";


    // Show dashboard.

    dashboardContainer.classList.add("active");


    // User information.

    const firstName = user.name.split(" ")[0];

    dashboardUserName.textContent = firstName;

    welcomeName.textContent = firstName;

    userAvatar.textContent = firstName.charAt(0).toUpperCase();


    profileName.textContent = user.name;

    profileEmail.textContent = user.email;

    accountName.textContent = user.name;

    accountEmail.textContent = user.email;


}


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener("click", function () {

    clearSession();


    // Hide dashboard.

    dashboardContainer.classList.remove("active");


    // Show login screen.

    authContainer.style.display = "grid";


    // Reset login form.

    loginForm.reset();

    showView(loginView);


    showToast("You have been logged out successfully.");

});


/* =========================================
   FORGOT PASSWORD DEMO
========================================= */

forgotForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors(forgotForm);


    const email = forgotEmail.value.trim().toLowerCase();


    if (!isValidEmail(email)) {

        showFieldError(
            forgotEmail,
            "forgot-email-error",
            "Please enter a valid email address."
        );

        return;

    }


    const userExists = users.some(
        user => user.email === email
    );


    if (userExists) {

        showToast(
            "Account found. Real password reset requires a backend and email service."
        );

    } else {

        showToast(
            "If an account exists, password recovery can be arranged through the backend."
        );

    }


    forgotForm.reset();

});


/* =========================================
   SESSION RESTORATION
========================================= */

function restoreSession() {

    const activeEmail = getActiveSession();

    if (!activeEmail) {

        authContainer.style.display = "grid";

        dashboardContainer.classList.remove("active");

        return;

    }


    const user = users.find(
        item => item.email === activeEmail
    );


    if (user) {

        openDashboard(user);

    } else {

        clearSession();

        authContainer.style.display = "grid";

        dashboardContainer.classList.remove("active");

    }

}


/* =========================================
   INITIALIZE APPLICATION
========================================= */

function initializeApp() {

    // Show login screen by default.

    authContainer.style.display = "grid";

    dashboardContainer.classList.remove("active");


    // Restore an existing session if available.

    restoreSession();


    // Initialize password strength indicator.

    checkPasswordStrength("");

}


// Start application.

initializeApp();
