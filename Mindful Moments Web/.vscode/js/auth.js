import { auth } from './firebase-config.js';
import { signOut } from 'firebase/auth';

class Auth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;

        // Listen for auth state changes
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL
                };
                this.isAuthenticated = true;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            } else {
                this.currentUser = null;
                this.isAuthenticated = false;
                localStorage.removeItem('currentUser');
            }
        });
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    getCurrentUser() {
        return this.currentUser || JSON.parse(localStorage.getItem('currentUser'));
    }

    async logout() {
        try {
            await signOut(auth);
            window.location.href = 'welcome-page.html';
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }
}

// Create and export a single instance
const authInstance = new Auth();
export default authInstance; 