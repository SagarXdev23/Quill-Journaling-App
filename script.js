// ========================================
// COMPLETE WORKING QUILL APP SCRIPT
// ========================================

console.log('✅ Script loaded successfully');

// ========================================
// CHAT POPUP FUNCTIONALITY
// ========================================
const chatBtn = document.querySelector('.chat-container');
let chatBox;

if (chatBtn) {
  chatBtn.addEventListener('click', () => {
    if (chatBox) {
      chatBox.remove();
      chatBox = null;
      return;
    }

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

    chatBox.querySelector('.close-btn').addEventListener('click', () => {
      chatBox.remove();
      chatBox = null;
    });
  });
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

function logout() {
  const confirmLogout = confirm('Are you sure you want to logout?');
  if (confirmLogout) {
    localStorage.removeItem('currentUser');
    alert('👋 Logged out successfully!');
    window.location.href = 'index.html';
  }
}

function updateUIForLoggedInUser() {
  const currentUser = getCurrentUser();
  
  if (currentUser && currentUser.name) {
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
// REGISTRATION
// ========================================
if (window.location.pathname.includes('register.html')) {
  console.log('📝 Register page loaded');
  
  const registerForm = document.querySelector('form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('🔄 Registration form submitted');
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      console.log('Form data:', { name, email, passwordLength: password.length });
      
      if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
      }
      
      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('quillUsers') || '[]');
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        alert('Email already registered. Please login.');
        window.location.href = 'login.html';
        return;
      }
      
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('quillUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ 
        id: newUser.id,
        name, 
        email 
      }));
      
      console.log('✅ User registered:', newUser);
      alert(`🎉 Registration successful! Welcome to Quill, ${name}!`);
      window.location.href = 'create-journal.html';
    });
  }
}

// ========================================
// LOGIN
// ========================================
if (window.location.pathname.includes('login.html')) {
  console.log('🔐 Login page loaded');
  
  const loginForm = document.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('🔄 Login form submitted');
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      console.log('Login attempt:', { email });
      
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('quillUsers') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ 
          id: user.id,
          name: user.name, 
          email: user.email 
        }));
        
        console.log('✅ Login successful:', user);
        alert(`👋 Welcome back, ${user.name}!`);
        window.location.href = 'create-journal.html';
      } else {
        console.log('❌ Login failed');
        alert('❌ Invalid email or password. Please try again.');
      }
    });
  }
}

// ========================================
// CREATE JOURNAL - THIS IS THE IMPORTANT PART!
// ========================================
if (window.location.pathname.includes('create-journal.html')) {
  console.log('✍️ Create Journal page loaded');
  
  // Check login
  const currentUser = getCurrentUser();
  if (!currentUser.email) {
    alert('⚠️ Please login first to create journals');
    window.location.href = 'login.html';
  } else {
    console.log('✅ User logged in:', currentUser);
    updateUIForLoggedInUser();
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('journalForm');
      console.log('Form element found:', form ? 'YES' : 'NO');
      
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('🔄 Journal form submitted');
          
          // Get form values
          const titleInput = document.getElementById('main-title');
          const entryInput = document.getElementById('journal-entry');
          const categoryInput = document.querySelector('input[name="category"]:checked');
          
          console.log('Form elements:', {
            titleInput: titleInput ? 'found' : 'NOT FOUND',
            entryInput: entryInput ? 'found' : 'NOT FOUND',
            categoryInput: categoryInput ? 'found' : 'NOT FOUND'
          });
          
          if (!titleInput || !entryInput || !categoryInput) {
            alert('❌ Error: Form elements not found!');
            console.error('Missing form elements');
            return;
          }
          
          const title = titleInput.value.trim();
          const entry = entryInput.value.trim();
          const category = categoryInput.value;
          
          console.log('Form values:', { title, entry: entry.substring(0, 50) + '...', category });
          
          // Validation
          if (!title || !entry) {
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
          
          // Create journal object
          const journal = {
            id: Date.now(),
            title: title,
            category: category,
            entry: entry,
            date: new Date().toISOString(),
            userEmail: currentUser.email,
            userName: currentUser.name
          };
          
          console.log('📝 New journal:', journal);
          
          // Save to localStorage
          try {
            const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
            console.log('📚 Existing journals:', journals.length);
            
            journals.unshift(journal);
            localStorage.setItem('quillJournals', JSON.stringify(journals));
            
            console.log('✅ Journal saved! Total journals:', journals.length);
            
            // Verify it was saved
            const verifyJournals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
            console.log('🔍 Verification - Total journals in storage:', verifyJournals.length);
            
            alert('✅ Journal saved successfully!');
            
            // Clear form
            form.reset();
            const charCount = document.getElementById('charCount');
            if (charCount) charCount.textContent = '0';
            
            // Ask to view journals
            const viewJournals = confirm('Journal saved! Would you like to view all your journals?');
            if (viewJournals) {
              window.location.href = 'view-journals.html';
            }
          } catch (error) {
            console.error('❌ Error saving journal:', error);
            alert('Error saving journal: ' + error.message);
          }
        });
        
        console.log('✅ Form event listener attached');
      } else {
        console.error('❌ Form not found!');
      }
    });
  }
}

// ========================================
// UPDATE UI ON PAGE LOAD
// ========================================
window.addEventListener('DOMContentLoaded', () => {
  console.log('🌐 Page loaded:', window.location.pathname);
  updateUIForLoggedInUser();
  
  // Debug: Show current user and journals
  const currentUser = getCurrentUser();
  const journals = JSON.parse(localStorage.getItem('quillJournals') || '[]');
  console.log('👤 Current user:', currentUser);
  console.log('📚 Total journals in storage:', journals.length);
});
