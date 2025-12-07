const API_BASE = "http://localhost:8080";

// Toggle between Sign In and Sign Up forms
function toggleForm() {
    var formTitle = document.getElementById("form-title");
    var authForm = document.getElementById("auth-form");

    if (!authForm) return;

    // when first loaded from signin.html, formTitle exists
    // after we rewrite, we always recreate it with the same id
    if (formTitle && formTitle.textContent === "Sign In") {
        // switch to Sign Up
        authForm.innerHTML = `
            <h2 id="form-title">Sign Up</h2>
            <form id="signUpForm">
                <input type="text" id="name" placeholder="Your name" />
                <div id="nameError" class="error"></div>

                <input type="text" id="email" placeholder="Your email address" />
                <div id="emailError" class="error"></div>

                <input type="password" id="password" placeholder="Password" />
                <div id="passwordError" class="error"></div>

                <input type="password" id="confirmPassword" placeholder="Confirm Password" />
                <div id="confirmPasswordError" class="error"></div>

                <button type="submit">Sign Up</button>
                <p class="toggle-auth" onclick="toggleForm()">Already have an account? Sign In</p>
            </form>
        `;
        addSignUpValidation();
    } else {
        // switch to Sign In
        authForm.innerHTML = `
            <h2 id="form-title">Sign In</h2>
            <form id="signInForm">
                <input type="text" id="email" placeholder="Your email address" />
                <div id="emailError" class="error"></div>

                <input type="password" id="password" placeholder="Password" />
                <div id="passwordError" class="error"></div>

                <button type="submit">Sign In</button>
                <p class="toggle-auth" onclick="toggleForm()">Don't have an account? Sign Up</p>
            </form>
        `;
        addSignInValidation();
    }
}

// helper: store user + redirect based on role
function handleSuccessfulLogin(body) {
    const user = {
        email: body.email,
        role: body.role
    };
    localStorage.setItem("luneUser", JSON.stringify(user));

    alert(body.message || "Login successful");

    if (body.role === "ADMIN") {
        window.location.href = "admin-reservations.html";
    } else {
        window.location.href = "index.html";
    }
}

// Sign In form validation + backend call
function addSignInValidation() {
    var signInForm = document.getElementById("signInForm");
    if (!signInForm) return;

    signInForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value;

        var emailError = document.getElementById("emailError");
        var passwordError = document.getElementById("passwordError");

        emailError.textContent = '';
        passwordError.textContent = '';

        var isValid = true;

        var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            emailError.textContent = "Please enter a valid email";
            isValid = false;
        }

        if (password.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!isValid) return;

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const body = await res.json();

            if (!res.ok || !body.success) {
                passwordError.textContent = body.message || "Invalid email or password";
                return;
            }

            handleSuccessfulLogin(body);
        } catch (err) {
            console.error(err);
            passwordError.textContent = "Server error. Please try again.";
        }
    });
}

// Sign Up form validation + backend call
function addSignUpValidation() {
    var signUpForm = document.getElementById("signUpForm");
    if (!signUpForm) return;

    signUpForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        var name = document.getElementById("name").value.trim();
        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("confirmPassword").value;

        var nameError = document.getElementById("nameError");
        var emailError = document.getElementById("emailError");
        var passwordError = document.getElementById("passwordError");
        var confirmPasswordError = document.getElementById("confirmPasswordError");

        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';

        var isValid = true;

        var nameReg = /^[a-zA-Z]{2,10}$/;
        if (!nameReg.test(name)) {
            nameError.textContent = "Name must be 2-10 letters";
            isValid = false;
        }

        var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            emailError.textContent = "Please enter a valid email";
            isValid = false;
        }

        if (password.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters";
            isValid = false;
        }

        if (password !== confirmPassword) {
            confirmPasswordError.textContent = "Passwords do not match";
            isValid = false;
        }

        if (!isValid) return;

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const body = await res.json();

            if (!res.ok || !body.success) {
                emailError.textContent = body.message || "Registration failed";
                return;
            }

            alert(body.message || "Sign Up successful. You can now sign in.");
            // After successful sign-up, go back to Sign In form
            toggleForm();
        } catch (err) {
            console.error(err);
            emailError.textContent = "Server error. Please try again.";
        }
    });
}

// Initialize Sign In form validation on first load
addSignInValidation();


(function () {
    var navigation = document.getElementById("nav");
    var menuToggle = document.getElementById("menu-toggle");
    var links = document.getElementById("nav-links");

    if (navigation && menuToggle && links) {
        menuToggle.addEventListener("click", function () {
            links.classList.toggle("show");
            if (links.classList.contains("show")) {
                navigation.classList.add("SmallHeight");
                navigation.classList.add("gap");
            } else {
                navigation.classList.remove("SmallHeight");
                navigation.classList.remove("gap");
            }
        });
    }
})();

// dark mode toggle (reuses your existing logic)
function toggleSwitch() {
    var ball = document.getElementById('ball');
    document.body.classList.toggle('darkMode');

    if (document.body.classList.contains("darkMode")) {
        ball.src = "https://img.icons8.com/?size=100&id=54382&format=png&color=FA5252";
    } else {
        ball.src = "https://img.icons8.com/?size=100&id=GIywaBFJCJiI&format=png&color=FA5252";
    }
}

// navbar auth logic: show Admin/Logout depending on localStorage.luneUser
function setupAuthNavbar() {
    var adminLi  = document.getElementById("admin-link");
    var signinLi = document.getElementById("signin-link");
    var logoutLi = document.getElementById("logout-link");

    if (!adminLi || !signinLi || !logoutLi) return;

    var stored = localStorage.getItem("luneUser");
    if (!stored) {
        adminLi.style.display  = "none";
        logoutLi.style.display = "none";
        signinLi.style.display = "inline-block";
    } else {
        try {
            var user = JSON.parse(stored);

            signinLi.style.display = "none";
            logoutLi.style.display = "inline-block";

            if (user && user.role === "ADMIN") {
                adminLi.style.display = "inline-block";
            } else {
                adminLi.style.display = "none";
            }
        } catch (e) {
            console.error("Failed to parse luneUser", e);
            adminLi.style.display  = "none";
            logoutLi.style.display = "none";
            signinLi.style.display = "inline-block";
        }
    }

    logoutLi.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("luneUser");
        window.location.href = "index.html";
    });
}

document.addEventListener("DOMContentLoaded", setupAuthNavbar);