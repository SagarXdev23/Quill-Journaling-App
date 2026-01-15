// script.js - Complete Quill Journaling App JavaScript

// ========================================
// CHAT POPUP FUNCTIONALITY
// ========================================
const chatBtn = document.querySelector('.chat-container');
let chatBox;

if (chatBtn) {
  chatBtn.addEventListener('click', () => {
    // If popup already exists, remove it
    if (chatBox) {
      chatBox.remove();
      chatBox = null;
      return;
    }

    // Otherwise create popup
    chatBox = document.createElement('div');
    chatBox.className = 'chat-box';
    chatBox.innerHTML = `
      <div class="chat-header">
        Chat <span class="close-btn">&times;</span>
      </div>
      <div class="chat-body">
        <p>Chat feature coming soon...</p>
      </div>
    `;
    document.body.appendChild(chatBox);

    // Close button inside chat
    chatBox.querySelector('.close-btn').addEventListener('click', () => {
      chatBox.remove();
      chatBox = null;
    });
  });
}

// ========================================
// UPDATE UI FOR LOGGED IN USERS
// ========================================
function updateUIForLoggedInUser() {
  const currentUser = getCurrentUser();
  
  if (currentUser && currentUser.name) {
    // Update navigation buttons
    const navBtnContainer = document.querySelector('.nav-btn-container');
    
    if (navBtnContainer) {
      navBtnContainer.innerHTML = `
        <li>
          <span style="color: var(--grey-shade); font-size: 1.6rem; font-weight: 600; margin-right: 1rem;">
            Welcome, ${currentUser.name}!
          </span>
        </li>
        <li><a class="btn btn-primary-outline" href="view-journals.html">📚 My Journals</a></li>
        <li><a class="btn btn-primary-outline" href="create-journal.html">✍️ Create</a></li>
        <li><a class="btn btn-primary" href="#" onclick="logout(); return false;">Logout</a></li>
      `;
    }
  }
}

// ========================================
// REGISTRATION FUNCTIONALITY
// ========================================
const registerForm = document.querySelector('form');
if (registerForm && window.location.pathname.includes('register.html')) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validation
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Get existing users or create empty array
    const users = JSON.parse(localStorage.getItem('quillUsers') || '[]');
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      alert('Email already registered. Please login.');
      window.location.href = 'login.html';
      return;
    }
    
    // Add new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('quillUsers', JSON.stringify(users));
    
    // Set current user (without password)
    localStorage.setItem('currentUser', JSON.stringify({ 
      id: newUser.id,
      name, 
      email 
    }));
    
    // Show welcome message and redirect
    alert(`🎉 Registration successful! Welcome to Quill, ${name}!`);
    window.location.href = 'create-journal.html';
  });
}

// ========================================
// LOGIN FUNCTIONALITY
// ========================================
const loginForm = document.querySelector('form');
if (loginForm && window.location.pathname.includes('login.html')) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('quillUsers') || '[]');
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Set current user (without password)
      localStorage.setItem('currentUser', JSON.stringify({ 
        id: user.id,
        name: user.name, 
        email: user.email 
      }));
      
      // Show welcome message and redirect
      alert(`👋 Welcome back, ${user.name}!`);
      window.location.href = 'create-journal.html';
    } else {
      alert('❌ Invalid email or password. Please try again.');
    }
  });
}

// ========================================
// JOURNAL CREATION FUNCTIONALITY
// ========================================
const journalForm = document.querySelector('.journal-form');
if (journalForm) {
  // Check if user is logged in on page load
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!currentUser.email) {
    alert('⚠️ Please login first to create journals');
    window.location.href = 'login.html';
  } else {
    // Update UI for logged in user
    updateUIForLoggedInUser();
    
    // Show welcome message at top of journal page
    const journalSection = document.querySelector('.journal-section');
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
      text-align: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    welcomeMsg.innerHTML = `
      <h3 style="font-size: 2.4rem; margin-bottom: 0.5rem;">👋 Welcome, ${currentUser.name}!</h3>
      <p style="font-size: 1.6rem; opacity: 0.9;">Start documenting your thoughts and reflections</p>
    `;
    journalSection.insertBefore(welcomeMsg, journalSection.firstChild);
  }
  
  // Load existing journals count
  loadJournalStats();
  
  journalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('main-title').value.trim();
    const category = document.getElementById('journal-category').value;
    const entry = document.getElementById('journal-entry').value.trim();
    
    // Validation
    if (!title || !category || !entry) {
      alert('Please fill in all fields');
      return;
    }
    
    if (title.length < 3) {
      alert('Title must be at least 3 characters long');
      return;
    }
    
    if (entry.length < 10) {
      alert('Journal entry must be at least 10 characters long');
      return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.email) {
      alert('Session expired. Please login again.');
      window.location.href = 'login.html';
      return;
    }
    
    // Create journal object
    const journal = {
      id: Date.now(),
      title,
      category,
      entry,
      date: new Date().toISOString(),
      userEmail: currentUser.email,
      userName: currentUser.name
    };
    
    // Get existing journals or create empty array
    const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
    
    // Add new journal at the beginning (most recent first)
    journals.unshift(journal);
    localStorage.setItem('quillJournals', JSON.stringify(journals));
    
    alert('✅ Journal saved successfully!');
    
    // Clear form
    journalForm.reset();
    
    // Update stats
    loadJournalStats();
    
    // Optional: Ask if user wants to create another
    const createAnother = confirm('Journal saved! Would you like to create another journal?');
    if (!createAnother) {
      // Stay on the page
    }
  });
}

// ========================================
// UPDATE UI ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  
  // Update UI if user is logged in
  if (currentUser && currentUser.name) {
    updateUIForLoggedInUser();
    console.log(`✅ Logged in as: ${currentUser.name} (${currentUser.email})`);
  }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

// Function to load and display journal statistics
function loadJournalStats() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (currentUser.email) {
    const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
    const userJournals = journals.filter(j => j.userEmail === currentUser.email);
    
    console.log(`📊 Total journals: ${userJournals.length}`);
    console.log('📚 Your journals:', userJournals);
  }
}

// Function to get all user journals
function getUserJournals() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!currentUser.email) {
    return [];
  }
  
  const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
  return journals.filter(j => j.userEmail === currentUser.email);
}

// Function to get journals by category
function getJournalsByCategory(category) {
  const userJournals = getUserJournals();
  return userJournals.filter(j => j.category === category);
}

// Function to delete a journal
function deleteJournal(journalId) {
  const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
  const updatedJournals = journals.filter(j => j.id !== journalId);
  localStorage.setItem('quillJournals', JSON.stringify(updatedJournals));
  return true;
}

// Function to update a journal
function updateJournal(journalId, updates) {
  const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
  const journalIndex = journals.findIndex(j => j.id === journalId);
  
  if (journalIndex !== -1) {
    journals[journalIndex] = { ...journals[journalIndex], ...updates };
    localStorage.setItem('quillJournals', JSON.stringify(journals));
    return true;
  }
  
  return false;
}

// Function to logout user
function logout() {
  const confirmLogout = confirm('Are you sure you want to logout?');
  
  if (confirmLogout) {
    localStorage.removeItem('currentUser');
    alert('👋 Logged out successfully!');
    window.location.href = 'index.html';
  }
}

// Function to get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

// ========================================
// EXPORT FUNCTIONS (for use in other pages)
// ========================================
// You can use these functions in your HTML pages:
// - getUserJournals()
// - getJournalsByCategory(category)
// - deleteJournal(journalId)
// - updateJournal(journalId, updates)
// - logout()
// - getCurrentUser()
