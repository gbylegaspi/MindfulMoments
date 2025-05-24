document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initDashboard();
    
    // Add event listeners
    addEventListeners();

    // Set default welcome message
    const greeting = document.getElementById('greeting');
    if (greeting) {
        greeting.textContent = 'Welcome to Mindful Moments!';
    }

    // Set current date
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
});

function updateUserInfo(user) {
    // Update welcome message
    const greeting = document.getElementById('greeting');
    if (greeting) {
        greeting.textContent = `Welcome back, ${user.firstName}!`;
    }

    // Update user profile section
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = `${user.firstName} ${user.lastName}`;
    }

    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.textContent = `${user.firstName[0]}${user.lastName[0]}`;
    }

    // Update user stats
    updateUserStats(user);
}

function updateUserStats(user) {
    // Update total meditation time
    const totalMeditationTime = document.getElementById('totalMeditationTime');
    if (totalMeditationTime) {
        totalMeditationTime.textContent = '0h 0m'; // Placeholder - will be replaced with real data
    }

    // Update current streak
    const currentStreak = document.getElementById('currentStreak');
    if (currentStreak) {
        currentStreak.textContent = '0 days'; // Placeholder - will be replaced with real data
    }

    // Update journal entries count
    const journalEntries = document.getElementById('journalEntries');
    if (journalEntries) {
        journalEntries.textContent = '0'; // Placeholder - will be replaced with real data
    }

    // Update average mood
    const averageMood = document.getElementById('averageMood');
    if (averageMood) {
        averageMood.textContent = '0.0'; // Placeholder - will be replaced with real data
    }
}

function initDashboard() {
    // Initialize any dashboard-specific components
    initProgressCharts();
    initRecentActivity();
    initUpcomingSessions();
}

function initProgressCharts() {
    // This will be implemented when we have actual progress data
    const progressContainer = document.querySelector('.progress-charts');
    if (progressContainer) {
        // Placeholder for progress charts
        progressContainer.innerHTML = '<p>Progress charts will be displayed here</p>';
    }
}

function initRecentActivity() {
    // This will be implemented when we have actual activity data
    const activityContainer = document.querySelector('.recent-activity');
    if (activityContainer) {
        // Placeholder for recent activity
        activityContainer.innerHTML = '<p>Recent activity will be displayed here</p>';
    }
}

function initUpcomingSessions() {
    // This will be implemented when we have actual session data
    const sessionsContainer = document.querySelector('.upcoming-sessions');
    if (sessionsContainer) {
        // Placeholder for upcoming sessions
        sessionsContainer.innerHTML = '<p>Upcoming sessions will be displayed here</p>';
    }
}

function addEventListeners() {
    // Logout button
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    // Mobile menu trigger
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', toggleMobileMenu);
    }

    // User profile dropdown
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            userProfile.classList.toggle('active');
        });
    }

    // Profile settings button
    const profileSettingsBtn = document.querySelector('.profile-settings-btn');
    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', () => {
            window.location.href = 'profile-html.html';
        });
    }

    // Quick start meditation button
    const quickStartBtn = document.querySelector('.quick-start-btn');
    if (quickStartBtn) {
        quickStartBtn.addEventListener('click', () => {
            window.location.href = 'sessions-html.html';
        });
    }
}

async function handleLogout() {
    try {
        await auth.logout();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout failed:', error);
        // Show error message to user
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Failed to logout. Please try again.';
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Initialize dashboard
function initializeDashboard() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize user profile dropdown
    initUserProfile();
    
    // Load user profile
    loadUserProfile();
    
    // Load all data
    loadAllData();
    
    // Set up real-time listeners
    setupRealTimeListeners();
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuTrigger && sidebar) {
        mobileMenuTrigger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                !mobileMenuTrigger.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Initialize user profile dropdown
function initUserProfile() {
    const profileButton = document.querySelector('.user-profile-button');
    const profileDropdown = document.querySelector('.user-profile-dropdown');
    
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', function() {
            profileDropdown.classList.toggle('active');
        });
    }
}

// Load user profile
async function loadUserProfile() {
    try {
        const userId = DataManager.getCurrentUserId();
        if (!userId) {
            window.location.href = 'index.html';
            return;
        }

        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            const userName = `${userData.firstName} ${userData.lastName}`;
            
            // Update user name in the header
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = userName;
            }
            
            // Update user avatar initials
            const avatarElement = document.querySelector('.avatar');
            if (avatarElement) {
                avatarElement.textContent = userData.firstName.charAt(0) + userData.lastName.charAt(0);
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load user profile. Please try refreshing the page.');
    }
}

// Load all data
async function loadAllData() {
    try {
        await Promise.all([
            loadRecentMoodEntries(),
            loadRecentJournalEntries(),
            loadRecentSessions(),
            loadCommunityInteractions()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data. Please try refreshing the page.');
    }
}

// Set up real-time listeners
function setupRealTimeListeners() {
    try {
        // Listen for journal entry updates
        DataManager.onJournalEntriesUpdate((entries) => {
            renderJournalEntries(entries);
        });
        
        // Listen for mood entry updates
        DataManager.onMoodEntriesUpdate((entries) => {
            renderMoodEntries(entries);
        });
    } catch (error) {
        console.error('Error setting up real-time listeners:', error);
    }
}

// Load and render recent mood entries
async function loadRecentMoodEntries() {
    try {
        const entries = await DataManager.getMoodEntries();
        renderMoodEntries(entries);
    } catch (error) {
        console.error('Error loading mood entries:', error);
        const container = document.getElementById('mood-entries-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Failed to load mood entries. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Render mood entries
function renderMoodEntries(entries) {
    const container = document.getElementById('mood-entries-container');
    if (!container) return;
    
    // Sort entries by date (newest first)
    entries.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="no-entries-message">
                <p>No mood entries yet. Start tracking your mood!</p>
                <a href="mood-tracker-html.html" class="btn">Track Mood</a>
            </div>
        `;
        return;
    }
    
    // Display the 5 most recent entries
    const recentEntries = entries.slice(0, 5);
    
    const entriesHTML = recentEntries.map(entry => {
        const date = entry.createdAt.toDate().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        const moodEmoji = getMoodEmoji(entry.mood);
        
        return `
            <div class="mood-entry-card">
                <div class="entry-date">${date}</div>
                <div class="mood-display">
                    <span class="mood-emoji">${moodEmoji}</span>
                    <span class="mood-text">${entry.mood}</span>
                </div>
                ${entry.note ? `<p class="mood-note">${entry.note}</p>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = entriesHTML;
}

// Load and render recent journal entries
async function loadRecentJournalEntries() {
    try {
        const entries = await DataManager.getJournalEntries();
        renderJournalEntries(entries);
    } catch (error) {
        console.error('Error loading journal entries:', error);
        const container = document.getElementById('journal-entries-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Failed to load journal entries. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Render journal entries
function renderJournalEntries(entries) {
    const container = document.getElementById('journal-entries-container');
    if (!container) return;
    
    // Sort entries by date (newest first)
    entries.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="no-entries-message">
                <p>No journal entries yet. Start writing your first entry!</p>
                <a href="journal-html.html" class="btn">Write Entry</a>
            </div>
        `;
        return;
    }
    
    // Display the 3 most recent entries
    const recentEntries = entries.slice(0, 3);
    
    const entriesHTML = recentEntries.map(entry => {
        const date = entry.createdAt.toDate().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const excerpt = entry.content.length > 150 
            ? entry.content.substring(0, 150) + '...' 
            : entry.content;
        
        const moodTags = entry.moodTags ? entry.moodTags.map(tag => `
            <span class="mood-tag">${tag} ${getMoodEmoji(tag)}</span>
        `).join('') : '';
        
        return `
            <div class="journal-entry-card">
                <div class="entry-date">${date}</div>
                <h3 class="entry-title">${entry.title || 'Untitled'}</h3>
                <p class="entry-excerpt">${excerpt}</p>
                ${moodTags ? `<div class="entry-moods">${moodTags}</div>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = entriesHTML;
}

// Load and render recent meditation sessions
async function loadRecentSessions() {
    try {
        const sessions = await DataManager.getMeditationSessions();
        renderSessions(sessions);
    } catch (error) {
        console.error('Error loading meditation sessions:', error);
        const container = document.getElementById('sessions-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Failed to load meditation sessions. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Render meditation sessions
function renderSessions(sessions) {
    const container = document.getElementById('sessions-container');
    if (!container) return;
    
    // Sort sessions by date (newest first)
    sessions.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA;
    });
    
    if (!sessions || sessions.length === 0) {
        container.innerHTML = `
            <div class="no-entries-message">
                <p>No meditation sessions yet. Start your first session!</p>
                <a href="meditation-html.html" class="btn">Start Session</a>
            </div>
        `;
        return;
    }
    
    // Display the 3 most recent sessions
    const recentSessions = sessions.slice(0, 3);
    
    const sessionsHTML = recentSessions.map(session => {
        const date = session.createdAt ? 
            session.createdAt.toDate().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'No date';
        
        const duration = formatDuration(session.duration || 0);
        const color = getSessionColor(session.type || 'mindfulness');
        
        return `
            <div class="session-card" style="border-left: 4px solid ${color}">
                <div class="session-date">${date}</div>
                <h3 class="session-title">${session.title || 'Untitled Session'}</h3>
                <div class="session-info">
                    <span class="session-type">${session.type || 'Mindfulness'}</span>
                    <span class="session-duration">${duration}</span>
                </div>
                <p class="session-description">${session.description || ''}</p>
            </div>
        `;
    }).join('');
    
    container.innerHTML = sessionsHTML;
}

// Load and render community interactions
async function loadCommunityInteractions() {
    try {
        const interactions = await DataManager.getCommunityInteractions();
        renderCommunityInteractions(interactions);
    } catch (error) {
        console.error('Error loading community interactions:', error);
        alert('Failed to load community interactions. Please try again.');
    }
}

// Render community interactions
function renderCommunityInteractions(interactions) {
    const container = document.getElementById('community-container');
    if (!container) return;
    
    // Sort interactions by date (newest first)
    interactions.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    
    if (interactions.length === 0) {
        container.innerHTML = `
            <div class="no-entries-message">
                <p>No community interactions yet. Join the conversation!</p>
                <a href="community-html.html" class="btn">View Community</a>
            </div>
        `;
        return;
    }
    
    // Display the 3 most recent interactions
    const recentInteractions = interactions.slice(0, 3);
    
    const interactionsHTML = recentInteractions.map(interaction => {
        const timeAgo = getTimeAgo(interaction.createdAt.toDate());
        
        return `
            <div class="community-post">
                <div class="post-header">
                    <img src="${interaction.authorAvatar}" alt="${interaction.authorName}" class="author-avatar">
                    <div class="post-info">
                        <span class="author-name">${interaction.authorName}</span>
                        <span class="post-time">${timeAgo}</span>
                    </div>
                </div>
                <p class="post-content">${interaction.content}</p>
                <div class="post-stats">
                    <span class="likes">${interaction.likes} likes</span>
                    <span class="comments">${interaction.comments} comments</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = interactionsHTML;
}

// Helper functions
function getMoodEmoji(mood) {
    const emojis = {
        'happy': '😊',
        'sad': '😢',
        'anxious': '😰',
        'calm': '😌',
        'energetic': '⚡',
        'tired': '😴',
        'grateful': '🙏',
        'proud': '😌',
        'excited': '😃',
        'hopeful': '🌟',
        'relaxed': '😌',
        'curious': '🤔'
    };
    return emojis[mood.toLowerCase()] || '📝';
}

function getSessionColor(type) {
    const colors = {
        'guided': '#8DCA35',
        'breathing': '#5B9BD5',
        'body scan': '#FFD056',
        'loving-kindness': '#9F7BD5',
        'mindfulness': '#F06292'
    };
    return colors[type.toLowerCase()] || '#78909C';
}

function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe all elements with slide-in classes
    document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(el => {
      observer.observe(el);
    });
  });

 
  