document.addEventListener('DOMContentLoaded', function() {
    // Initialize the journal functionality
    initJournal();
    
    // Mobile menu functionality from dashboard.js
    initMobileMenu();

    const journalForm = document.getElementById('journal-form');
    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const moodTagsInput = document.getElementById('mood-tags');
    const saveButton = document.getElementById('save-entry');

    // Add event listener for form submission
    journalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const moodTags = moodTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        if (!content) {
            alert('Please write something in your journal entry');
            return;
        }

        // Save journal entry using DataManager
        DataManager.saveJournalEntry({
            title: title,
            content: content,
            moodTags: moodTags,
            excerpt: content.substring(0, 100) + '...'
        });

        // Clear form
        titleInput.value = '';
        contentInput.value = '';
        moodTagsInput.value = '';
        
        // Show success message
        alert('Journal entry saved successfully!');
        
        // Redirect to dashboard
        window.location.href = 'dashboard-html.html';
    });
});

function initJournal() {
    // Initialize with empty journal entries
    const journalEntries = [];
    
    // DOM Elements
    const journalEntriesList = document.getElementById('journal-entries-list');
    const journalListPanel = document.querySelector('.journal-list-panel');
    const journalEditorPanel = document.querySelector('.journal-editor-panel');
    const journalContainer = document.querySelector('.journal-container');
    const entryTitleInput = document.getElementById('entry-title');
    const entryContentTextarea = document.getElementById('entry-content');
    const entryMoodTags = document.getElementById('entry-mood-tags');
    const editorDateDisplay = document.querySelector('.editor-date');
    const newEntryBtn = document.getElementById('new-entry-btn');
    const mobileNewEntryBtn = document.getElementById('mobile-new-entry');
    const saveEntryBtn = document.getElementById('save-entry');
    const deleteEntryBtn = document.getElementById('delete-entry');
    const backToListBtn = document.getElementById('back-to-list');
    const journalSearchInput = document.getElementById('journal-search-input');
    const moodTagBtn = document.querySelector('.mood-tag-btn');
    const moodTagDropdown = document.querySelector('.mood-tag-dropdown');
    const journalPromptItems = document.querySelectorAll('.prompt-item');
    const editorTools = document.querySelectorAll('.editor-tool[data-format]');
    
    // Current Entry State
    let currentEntry = journalEntries[0];
    let isNewEntry = false;
    
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Update UI for mobile/desktop
    function updateViewMode() {
        if (isMobile()) {
            journalContainer.classList.add('mobile-view');
            if (isNewEntry || currentEntry) {
                journalContainer.classList.remove('show-list');
            } else {
                journalContainer.classList.add('show-list');
            }
        } else {
            journalContainer.classList.remove('mobile-view', 'show-list');
        }
    }
    
    // Initialize view mode on load
    updateViewMode();
    
    // Update view mode on window resize
    window.addEventListener('resize', updateViewMode);
    
    // Populate journal entries list
    function renderJournalList(entries = journalEntries) {
        journalEntriesList.innerHTML = '';
        
        entries.forEach(entry => {
            const entryItem = document.createElement('div');
            entryItem.className = `journal-entry-item ${entry.id === currentEntry.id ? 'active' : ''}`;
            entryItem.dataset.id = entry.id;
            
            entryItem.innerHTML = `
                <div class="entry-date">
                    <span class="entry-day">${entry.formattedDate.day}</span>
                    <span class="entry-month">${entry.formattedDate.month}</span>
                </div>
                <div class="entry-preview">
                    <h3 class="entry-title">${entry.title}</h3>
                    <p class="entry-excerpt">${entry.excerpt}</p>
                </div>
            `;
            
            entryItem.addEventListener('click', () => {
                loadEntry(entry.id);
                updateViewMode();
            });
            
            journalEntriesList.appendChild(entryItem);
        });
    }
    
    // Load entry content into editor
    function loadEntry(entryId) {
        isNewEntry = false;
        
        // Find the entry
        const entry = journalEntries.find(e => e.id === entryId);
        if (!entry) return;
        
        // Update current entry
        currentEntry = entry;
        
        // Update editor content
        entryTitleInput.value = entry.title;
        entryContentTextarea.value = entry.content;
        editorDateDisplay.textContent = entry.date;
        
        // Update mood tags
        renderMoodTags(entry.moodTags);
        
        // Update active state in entry list
        document.querySelectorAll('.journal-entry-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === entryId);
        });
        
        // Show save/delete buttons
        saveEntryBtn.style.display = 'block';
        deleteEntryBtn.style.display = 'block';
    }
    
    // Create a new entry
    function createNewEntry() {
        isNewEntry = true;
        
        // Create a temporary entry object
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        // Generate a temporary ID
        const tempId = 'new-entry-' + Date.now();
        
        currentEntry = {
            id: tempId,
            title: 'Untitled Entry',
            content: '',
            date: formattedDate,
            formattedDate: {
                day: today.getDate().toString(),
                month: today.toLocaleString('en-US', { month: 'short' }).toUpperCase()
            },
            moodTags: [],
            excerpt: ''
        };
        
        // Clear editor content
        entryTitleInput.value = '';
        entryContentTextarea.value = '';
        editorDateDisplay.textContent = formattedDate;
        
        // Clear mood tags
        renderMoodTags([]);
        
        // Remove active state from all entries
        document.querySelectorAll('.journal-entry-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Focus on title input
        entryTitleInput.focus();
        
        // Show save button, hide delete button for new entries
        saveEntryBtn.style.display = 'block';
        deleteEntryBtn.style.display = 'none';
        
        // Update view mode for mobile
        updateViewMode();
    }
    
    // Save the current entry
    function saveEntry() {
        const title = entryTitleInput.value.trim() || 'Untitled Entry';
        const content = entryContentTextarea.value;
        const excerpt = content.substring(0, 50) + '...';
        
        if (isNewEntry) {
            // Create a new entry object
            const newEntry = {
                id: currentEntry.id,
                title: title,
                content: content,
                date: currentEntry.date,
                formattedDate: currentEntry.formattedDate,
                moodTags: getCurrentMoodTags(),
                excerpt: excerpt
            };
            
            // Add to entries array (in a real app, this would be saved to a database)
            journalEntries.unshift(newEntry);
            
            // Update current entry
            currentEntry = newEntry;
            isNewEntry = false;
            
            // Show delete button now that the entry exists
            deleteEntryBtn.style.display = 'block';
        } else {
            // Update existing entry
            const entryIndex = journalEntries.findIndex(e => e.id === currentEntry.id);
            if (entryIndex !== -1) {
                journalEntries[entryIndex].title = title;
                journalEntries[entryIndex].content = content;
                journalEntries[entryIndex].moodTags = getCurrentMoodTags();
                journalEntries[entryIndex].excerpt = excerpt;
                
                // Update current entry
                currentEntry = journalEntries[entryIndex];
            }
        }
        
        // Re-render the journal list
        renderJournalList();
        
        // Show feedback (in a real app, this would have proper error handling)
        showNotification('Journal entry saved successfully!');
    }
    
    // Delete the current entry
    function deleteEntry() {
        if (isNewEntry) {
            // Just clear the form for new entries
            createNewEntry();
            return;
        }
        
        // Confirm deletion
        if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
            // Find and remove the entry
            const entryIndex = journalEntries.findIndex(e => e.id === currentEntry.id);
            if (entryIndex !== -1) {
                journalEntries.splice(entryIndex, 1);
                
                // Load another entry or create a new one if no entries left
                if (journalEntries.length > 0) {
                    loadEntry(journalEntries[0].id);
                } else {
                    createNewEntry();
                }
                
                // Re-render the journal list
                renderJournalList();
                
                // Show feedback
                showNotification('Journal entry deleted successfully!');
                
                // Update view mode for mobile
                updateViewMode();
            }
        }
    }
    
    // Render mood tags in the editor
    function renderMoodTags(tags) {
        entryMoodTags.innerHTML = '';
        
        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'mood-tag-pill';
            tagElement.dataset.mood = tag;
            
            // Define emoji for each mood
            const moodEmojis = {
                'happy': '😊',
                'sad': '😔',
                'anxious': '😰',
                'calm': '😌',
                'grateful': '🙏',
                'proud': '😌',
                'excited': '😃',
                'hopeful': '🌟',
                'relaxed': '😌',
                'curious': '🤔'
            };
            
            tagElement.innerHTML = `
                <span class="mood-icon">${moodEmojis[tag] || '😊'}</span>
                <span class="mood-label">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                <span class="remove-mood">×</span>
            `;
            
            // Add remove functionality
            tagElement.querySelector('.remove-mood').addEventListener('click', () => {
                tagElement.remove();
            });
            
            entryMoodTags.appendChild(tagElement);
        });
    }
    
    // Get current mood tags from the UI
    function getCurrentMoodTags() {
        const tagElements = entryMoodTags.querySelectorAll('.mood-tag-pill');
        return Array.from(tagElements).map(el => el.dataset.mood);
    }
    
    // Show a notification message
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--color-purple)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = 'var(--border-radius-md)';
        notification.style.boxShadow = 'var(--shadow-md)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Search entries
    function searchEntries(query) {
        if (!query) {
            renderJournalList();
            return;
        }
        
        query = query.toLowerCase();
        
        const filteredEntries = journalEntries.filter(entry => 
            entry.title.toLowerCase().includes(query) || 
            entry.content.toLowerCase().includes(query) ||
            entry.moodTags.some(tag => tag.toLowerCase().includes(query))
        );
        
        renderJournalList(filteredEntries);
    }
    
    // Add a mood tag to the current entry
    function addMoodTag(mood) {
        const currentTags = getCurrentMoodTags();
        
        // Don't add duplicate tags
        if (currentTags.includes(mood)) {
            return;
        }
        
        // Add new tag and re-render
        currentTags.push(mood);
        renderMoodTags(currentTags);
    }
    
    // Text editor formatting functions
    function formatText(format) {
        const textarea = entryContentTextarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let replacement = '';
        
        switch (format) {
            case 'bold':
                replacement = `**${selectedText}**`;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                break;
            case 'underline':
                replacement = `_${selectedText}_`;
                break;
            case 'list':
                // Add a bullet point for each line
                replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                break;
            default:
                replacement = selectedText;
        }
        
        // Replace the selected text with the formatted text
        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        
        // Update the selection to include the formatting characters
        textarea.setSelectionRange(start, start + replacement.length);
        textarea.focus();
    }
    
    // Add prompt text to the editor
    function addPromptToEditor(promptText) {
        const currentContent = entryContentTextarea.value;
        const promptWithNewlines = currentContent ? `\n\n${promptText}\n` : `${promptText}\n`;
        
        entryContentTextarea.value += promptWithNewlines;
        entryContentTextarea.focus();
        
        // Set cursor position at the end of the text
        entryContentTextarea.setSelectionRange(
            entryContentTextarea.value.length,
            entryContentTextarea.value.length
        );
    }
    
    // Event Listeners
    
    // New Entry button
    newEntryBtn.addEventListener('click', createNewEntry);
    
    // Mobile New Entry button
    if (mobileNewEntryBtn) {
        mobileNewEntryBtn.addEventListener('click', createNewEntry);
    }
    
    // Save Entry button
    saveEntryBtn.addEventListener('click', saveEntry);
    
    // Delete Entry button
    deleteEntryBtn.addEventListener('click', deleteEntry);
    
    // Back to List button
    backToListBtn.addEventListener('click', () => {
        journalContainer.classList.add('show-list');
    });
    
    // Mood tag button
    moodTagBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        moodTagDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!moodTagBtn.contains(e.target) && !moodTagDropdown.contains(e.target)) {
            moodTagDropdown.classList.remove('show');
        }
    });
    
    // Mood tag selection
    document.querySelectorAll('.mood-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            addMoodTag(tag.dataset.mood);
            moodTagDropdown.classList.remove('show');
        });
    });
    
    // Journal search
    journalSearchInput.addEventListener('input', function() {
        searchEntries(this.value);
    });
    
    // Journal prompts
    journalPromptItems.forEach(prompt => {
        prompt.addEventListener('click', () => {
            addPromptToEditor(prompt.dataset.prompt);
        });
    });
    
    // Editor formatting tools
    editorTools.forEach(tool => {
        tool.addEventListener('click', () => {
            formatText(tool.dataset.format);
        });
    });
    
    // Initialize the journal view
    renderJournalList();
    loadEntry(journalEntries[0].id);
}

// Mobile menu functionality from dashboard.js
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

// Load journal entries
function loadJournalEntries(userId) {
    return db.collection('users').doc(userId).collection('journal')
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
            const entries = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                entries.push({
                    id: doc.id,
                    title: data.title,
                    content: data.content,
                    date: data.date,
                    formattedDate: {
                        day: new Date(data.date.toDate()).getDate(),
                        month: new Date(data.date.toDate()).toLocaleString('en-US', { month: 'short' }).toUpperCase()
                    },
                    moodTags: data.moodTags || [],
                    excerpt: data.content.substring(0, 50) + '...'
                });
            });
            return entries;
        });
}

// Save journal entry
function saveJournalEntry(userId, entry) {
    // If new entry
    if (isNewEntry) {
        return db.collection('users').doc(userId).collection('journal').add({
            title: entry.title,
            content: entry.content,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
            moodTags: entry.moodTags,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } else {
        // Update existing entry
        return db.collection('users').doc(userId).collection('journal').doc(entry.id).update({
            title: entry.title,
            content: entry.content,
            moodTags: entry.moodTags,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// Initialize the journal form
function initJournalForm() {
    const journalForm = document.getElementById('journal-form');
    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const moodTagsInput = document.getElementById('mood-tags');
    const saveButton = document.getElementById('save-journal');
    
    // Add event listener for form submission
    journalForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const moodTags = moodTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        if (!content) {
            alert('Please enter some content for your journal entry');
            return;
        }
        
        try {
            // Save journal entry using DataManager
            await DataManager.saveJournalEntry({
                title: title,
                content: content,
                moodTags: moodTags
            });
            
            // Clear form
            titleInput.value = '';
            contentInput.value = '';
            moodTagsInput.value = '';
            
            // Show success message
            alert('Journal entry saved successfully!');
            
            // Redirect to dashboard
            window.location.href = 'dashboard-html.html';
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Failed to save journal entry. Please try again.');
        }
    });
}

// Load recent journal entries
async function loadRecentEntries() {
    try {
        const entries = await DataManager.getJournalEntries();
        
        // Sort entries by date (newest first)
        entries.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
        
        // Get the container for recent entries
        const recentEntriesContainer = document.getElementById('recent-entries');
        if (!recentEntriesContainer) return;
        
        if (entries.length === 0) {
            recentEntriesContainer.innerHTML = `
                <div class="no-entries-message">
                    <p>No journal entries yet. Start writing your first entry!</p>
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
            
            const moodTags = entry.moodTags.map(tag => `
                <span class="mood-tag">${tag} ${getMoodEmoji(tag)}</span>
            `).join('');
            
            return `
                <div class="journal-entry-card">
                    <div class="entry-date">${date}</div>
                    <h3 class="entry-title">${entry.title || 'Untitled'}</h3>
                    <p class="entry-excerpt">${excerpt}</p>
                    <div class="entry-moods">${moodTags}</div>
                </div>
            `;
        }).join('');
        
        recentEntriesContainer.innerHTML = entriesHTML;
    } catch (error) {
        console.error('Error loading recent entries:', error);
        alert('Failed to load recent entries. Please try again.');
    }
}

// Get mood emoji
function getMoodEmoji(mood) {
    const emojis = {
        'happy': '😊',
        'sad': '😢',
        'anxious': '😰',
        'calm': '😌',
        'energetic': '⚡',
        'tired': '😴'
    };
    return emojis[mood.toLowerCase()] || '📝';
}

// Initialize the view all button
function initViewAllButton() {
    const viewAllButton = document.querySelector('.view-all-btn');
    
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function() {
            // In a real application, this would navigate to a full entries view
            console.log('View all entries clicked');
            
            // For demonstration
            alert('This would navigate to a page showing all your journal entries');
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const journalArea = document.querySelector(".journal-text-area");
    const promptItems = document.querySelectorAll(".prompt-item");
    const placeholderText = "Write your thoughts here...";

    // Set placeholder initially if empty
    if (journalArea.textContent.trim() === "") {
        journalArea.textContent = placeholderText;
        journalArea.classList.add("placeholder");
    }

    journalArea.addEventListener("focus", function () {
        if (journalArea.classList.contains("placeholder")) {
            journalArea.textContent = "";
            journalArea.classList.remove("placeholder");
        }
    });

    journalArea.addEventListener("blur", function () {
        if (journalArea.textContent.trim() === "") {
            journalArea.textContent = placeholderText;
            journalArea.classList.add("placeholder");
        }
    });

    promptItems.forEach(item => {
        item.addEventListener("click", function () {
            const promptText = this.getAttribute("data-prompt");

            // Clear placeholder if it's showing
            if (journalArea.classList.contains("placeholder")) {
                journalArea.textContent = "";
                journalArea.classList.remove("placeholder");
            }

            // Add prompt on new lines if there's already content
            if (journalArea.textContent.trim() !== "") {
                journalArea.textContent += "\n\n" + promptText;
            } else {
                journalArea.textContent = promptText;
            }

            // Move caret to the end
            placeCaretAtEnd(journalArea);
        });
    });

    // Function to move the caret to the end
    function placeCaretAtEnd(el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // false = end of content
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
});