import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user);
        if (user) {
            window.location.href = 'dashboard-html.html';
        }
    });

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            console.log('Attempting to sign in...');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Sign in successful:', user);
            
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard-html.html';
            }, 1500);
        } catch (error) {
            console.error('Sign in error:', error);
            showError(error.message || 'Invalid credentials');
        }
    });

    // Add Google Sign-In button event
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            console.log('Google sign in clicked');
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
                window.location.href = 'dashboard-html.html';
            } catch (error) {
                console.error('Google sign in error:', error);
                showError('Google sign-in failed: ' + error.message);
            }
        });
    }
});

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function showError(message) {
    console.log('Showing error:', message);
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
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