import auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!auth.isUserAuthenticated()) {
        window.location.href = 'login-html.html';
        return;
    }

    const user = auth.getCurrentUser();
    if (!user) {
        window.location.href = 'login-html.html';
        return;
    }

    // Initialize mood tracker
    initMoodTracker();
    
    // Load existing mood entries
    loadMoodEntries();
    
    // Add event listeners
    addEventListeners();
});

function initMoodTracker() {
    const moodForm = document.getElementById('moodForm');
    if (!moodForm) {
        console.error('Mood form not found');
        return;
    }
    
    moodForm.addEventListener('submit', handleMoodSubmission);

    // Initialize mood selection
    const moodButtons = document.querySelectorAll('.mood-button');
    if (moodButtons.length === 0) {
        console.error('No mood buttons found');
        return;
    }
    
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
        });
    });
}

async function handleMoodSubmission(event) {
    event.preventDefault();

    const selectedMood = document.querySelector('.mood-button.active');
    if (!selectedMood) {
        showError('Please select a mood');
        return;
    }

    const moodValue = selectedMood.dataset.mood;
    const moodNotes = document.getElementById('moodNotes');
    if (!moodNotes) {
        console.error('Mood notes input not found');
        return;
    }
    
    const notes = moodNotes.value;
    const timestamp = new Date().toISOString();

    const moodEntry = {
        mood: moodValue,
        notes,
        timestamp,
        userId: auth.getCurrentUser().id
    };

    try {
        // This will be replaced with actual API call
        // await saveMoodEntry(moodEntry);
        
        // For now, we'll just show success and clear the form
        showSuccess('Mood recorded successfully!');
        clearMoodForm();
        loadMoodEntries(); // Reload the mood entries
    } catch (error) {
        console.error('Error saving mood entry:', error);
        showError('Failed to save mood entry. Please try again.');
    }
}

function clearMoodForm() {
    const moodForm = document.getElementById('moodForm');
    if (!moodForm) {
        console.error('Mood form not found');
        return;
    }
    
    moodForm.reset();
    
    // Remove active class from mood buttons
    const moodButtons = document.querySelectorAll('.mood-button');
    moodButtons.forEach(button => button.classList.remove('active'));
}

function loadMoodEntries() {
    const moodHistory = document.getElementById('moodHistory');
    if (!moodHistory) {
        console.error('Mood history container not found');
        return;
    }
    
    // This will be replaced with actual API call to get mood entries
    moodHistory.innerHTML = '<p>Mood history will be displayed here</p>';
}

function addEventListeners() {
    const moodFilter = document.getElementById('moodFilter');
    if (moodFilter) {
        moodFilter.addEventListener('change', () => {
            loadMoodEntries(); // Reload with filter
        });
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        console.error('Error message element not found');
        return;
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    if (!successMessage) {
        console.error('Success message element not found');
        return;
    }
    
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}