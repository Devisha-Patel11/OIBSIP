# AuthFlow – Login Authentication System

A modern and responsive frontend authentication system featuring user registration, login, form validation, password visibility, session management, and a personalized user dashboard.

## 🔗 Project Links

- **Live Demo:**https://devisha-patel11.github.io/OIBSIP/WebDev-L2-Authentication/
- **GitHub Repository:**https://github.com/Devisha-Patel11/OIBSIP/WebDev-L2-Authentication/

## 🌟 Project Overview

AuthFlow is a frontend-based Login Authentication System developed as part of the **Oasis Infobyte Web Development and Designing Internship – Level 2, Task 4**.

The application provides a simple interface for users to register, sign in, manage their login sessions, and access a personalized dashboard.

It demonstrates basic authentication concepts using HTML, CSS, JavaScript, browser Local Storage, and Session Storage.

## ✨ Features

- **User Registration:** Create an account using name, email, and password.
- **User Login:** Authenticate registered users using their credentials.
- **Form Validation:** Validate email, password, and required fields.
- **Duplicate Email Detection:** Prevent registration with an already registered email.
- **Password Visibility:** Show or hide password input.
- **Password Strength Checker:** Evaluate password strength.
- **Confirm Password:** Verify password confirmation during registration.
- **Session Management:** Maintain login sessions using browser storage.
- **Remember Me:** Optionally restore the login session.
- **User Dashboard:** Display personalized account information.
- **Logout:** End the current login session.
- **Forgot Password Demo:** Demonstrate the account recovery interface.
- **Toast Notifications:** Display success and error messages.
- **Responsive Design:** Support desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and forms |
| CSS3 | Styling and responsive design |
| JavaScript | Authentication logic and validation |
| Local Storage | Store demo user records |
| Session Storage | Manage temporary login sessions |
| Web Crypto API | SHA-256 password hashing demonstration |

## 📁 Project Structure

```text
WebDev-L2-Authentication/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Devisha-Patel11/OIBSIP.git
   ```

2. Navigate to the project directory:

   ```bash
   cd OIBSIP/WebDev-L2-Authentication
   ```

3. Open `index.html` using Visual Studio Code.

4. Run the project using the Live Server extension.

**Note:** Run the project on localhost or HTTPS so that the Web Crypto API is available.

## 🔐 Security Note

This project is an educational frontend authentication demonstration, not a production-ready authentication system.

- Passwords are hashed using the browser Web Crypto API before being stored.
- User records and session identifiers are stored in browser storage.
- SHA-256 alone is not recommended for production password storage.
- Browser-based authentication can be manipulated by users.
- Real-world authentication requires a secure backend, password hashing algorithms such as Argon2id or bcrypt, and secure server-managed sessions.
- The forgot password interface is a demonstration and does not send real recovery emails.

**Do not use real or sensitive credentials while testing this demo.**

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Building login and registration interfaces.
- JavaScript DOM manipulation and event handling.
- Form validation and error handling.
- Implementing basic authentication workflows.
- Working with Local Storage and Session Storage.
- Understanding password hashing concepts.
- Managing user sessions and dashboard navigation.
- Creating responsive authentication layouts.

## 👨‍💻 Internship Details

| Detail | Information |
|---|---|
| Organization | Oasis Infobyte |
| Internship Domain | Web Development and Designing |
| Internship Level | Level 2 |
| Task Number | Task 4 |
| Project Name | Login Authentication System |

## 🙏 Acknowledgement

I would like to thank **Oasis Infobyte** for providing this opportunity to enhance my frontend development skills through practical project development.

---

**Made with ❤️ using HTML, CSS, and JavaScript.**