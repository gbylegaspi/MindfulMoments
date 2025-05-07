// Remove auth import since we're not using it yet
// import auth from './auth.js';
import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    if (!signupForm) {
        console.error('Signup form not found!');
        return;
    }

    // Add form validation
    addFormValidation();

    // Handle form submission
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');
        
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            console.log('Attempting to create account...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Account created successfully:', userCredential.user);
            
            showSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard-html.html';
            }, 1500);
        } catch (error) {
            console.error('Signup error:', error);
            showError('general', error.message || 'An error occurred during signup');
        }
    });

    // Add Google Sign-Up button event
    const googleBtn = document.getElementById('google-signup-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            console.log('Google sign up clicked');
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
                window.location.href = 'dashboard-html.html';
            } catch (error) {
                console.error('Google sign up error:', error);
                showError('general', 'Google sign-up failed: ' + error.message);
            }
        });
    }
});

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function showError(field, message) {
    console.log('Showing error:', field, message);
    const errorElement = field === 'general' 
        ? document.getElementById('errorMessage')
        : document.getElementById(`${field}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(field) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function showSuccess(message) {
    console.log('Showing success:', message);
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

function addFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (!validateEmail(emailInput.value)) {
                showError('email', 'Please enter a valid email address');
            } else {
                hideError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            if (!validatePassword(passwordInput.value)) {
                showError('password', 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
            } else {
                hideError('password');
            }
        });
    }
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('blur', () => {
            if (confirmPasswordInput.value !== passwordInput.value) {
                showError('confirm-password', 'Passwords do not match');
            } else {
                hideError('confirm-password');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
} 