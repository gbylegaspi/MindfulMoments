document.addEventListener('DOMContentLoaded', function() {
    console.log('Mood tracker initialized');
    
    // Initialize mood tracker
    initMoodTracker();
});

function initMoodTracker() {
    console.log('Initializing mood tracker');
    
    // Initialize mood sliders
    const sliders = document.querySelectorAll('.mood-slider');
    console.log('Found sliders:', sliders.length);
    
    sliders.forEach(slider => {
        const moodName = slider.id.split('-')[0];
        const percentSpan = document.getElementById(`${moodName}-percent`);
        const trackDiv = document.getElementById(`${moodName}-track`);
        const color = slider.dataset.color;

        // Initial update
        updateSlider(slider, percentSpan, trackDiv, color);

        // On slider input
        slider.addEventListener('input', function() {
            updateSlider(slider, percentSpan, trackDiv, color);
        });
    });

    // Add save button event listener
    const saveButton = document.getElementById('saveMood');
    console.log('Save button found:', !!saveButton);
    
    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            console.log('Save button clicked');
            handleMoodSubmission(e);
        });
    }

    // Load and display recent entries
    loadRecentEntries();
}

function updateSlider(slider, percentSpan, trackDiv, color) {
    const value = slider.value;
    percentSpan.textContent = `${value}%`;
    trackDiv.style.background = `linear-gradient(to right, ${color} ${value}%, #eee ${value}%)`;
}

function handleMoodSubmission(event) {
    console.log('Handling mood submission');
    event.preventDefault();

    // Get all mood values
    const moodValues = {};
    const sliders = document.querySelectorAll('.mood-slider');
    sliders.forEach(slider => {
        const moodName = slider.id.replace('-slider', '');
        moodValues[moodName] = parseInt(slider.value);
    });
    console.log('Mood values:', moodValues);

    // Get notes
    const notes = document.getElementById('moodNotes')?.value || '';
    console.log('Notes:', notes);
    
    const timestamp = new Date().toISOString();

    const moodEntry = {
        id: 'mood-' + Date.now(),
        moods: moodValues,
        notes,
        timestamp,
        date: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
    console.log('Created mood entry:', moodEntry);

    try {
        // Save to localStorage
        let savedEntries = [];
        try {
            const storedEntries = localStorage.getItem('moodEntries');
            if (storedEntries) {
                savedEntries = JSON.parse(storedEntries);
            }
        } catch (e) {
            console.warn('No existing entries found, starting fresh');
        }
        
        console.log('Previous entries:', savedEntries.length);
        savedEntries.unshift(moodEntry);
        
        try {
            localStorage.setItem('moodEntries', JSON.stringify(savedEntries));
            console.log('Saved to localStorage');
            
            // Show success message
            showNotification('Mood recorded successfully!');
            
            // Clear form
            clearMoodForm();
            
            // Update recent entries display
            loadRecentEntries();
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            showNotification('Error saving mood entry. Please try again.');
        }
    } catch (error) {
        console.error('Error processing mood entry:', error);
        showNotification('Error saving mood entry. Please try again.');
    }
}

function clearMoodForm() {
    console.log('Clearing mood form');
    
    // Reset all sliders
    const sliders = document.querySelectorAll('.mood-slider');
    sliders.forEach(slider => {
        const moodName = slider.id.split('-')[0];
        const percentSpan = document.getElementById(`${moodName}-percent`);
        const trackDiv = document.getElementById(`${moodName}-track`);
        const color = slider.dataset.color;
        
        slider.value = 0;
        updateSlider(slider, percentSpan, trackDiv, color);
    });

    // Clear notes
    const notes = document.getElementById('moodNotes');
    if (notes) notes.value = '';
}

function showNotification(message) {
    console.log('Showing notification:', message);
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadRecentEntries() {
    console.log('Loading recent entries');
    const recentEntriesList = document.getElementById('recent-mood-entries-list');
    if (!recentEntriesList) return;

    try {
        const storedEntries = localStorage.getItem('moodEntries');
        if (!storedEntries) {
            recentEntriesList.innerHTML = '<p class="no-entries">No mood entries yet. Start tracking your mood!</p>';
            return;
        }

        const entries = JSON.parse(storedEntries);
        console.log('Loaded entries:', entries.length);

        // Display only the 5 most recent entries
        const recentEntries = entries.slice(0, 5);
        
        const entriesHTML = recentEntries.map(entry => {
            const date = new Date(entry.timestamp);
            const moodDots = Object.entries(entry.moods)
                .filter(([_, value]) => value > 0)
                .map(([mood, value]) => `
                    <div class="entry-mood-dot" 
                         style="background-color: ${getMoodColor(mood)};" 
                         title="${mood.charAt(0).toUpperCase() + mood.slice(1)}: ${value}%">
                    </div>
                `).join('');

            return `
                <div class="mood-entry">
                    <div class="entry-date">
                        <div class="day">${date.getDate()}</div>
                        <div class="month">${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
                    </div>
                    <div class="entry-content">
                        <div class="entry-moods">
                            ${moodDots}
                        </div>
                        ${entry.notes ? `<div class="entry-note">${entry.notes}</div>` : ''}
                        <div class="entry-time">${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                    </div>
                </div>
            `;
        }).join('');

        recentEntriesList.innerHTML = entriesHTML;
    } catch (error) {
        console.error('Error loading recent entries:', error);
        recentEntriesList.innerHTML = '<p class="error">Error loading mood entries. Please try refreshing the page.</p>';
    }
}

function getMoodColor(mood) {
    const colors = {
        happy: '#8DCA35',
        sad: '#5B9BD5',
        anxious: '#FFD056',
        calm: '#9F7BD5',
        energetic: '#F06292',
        tired: '#78909C'
    };
    return colors[mood] || '#8DCA35';
}

