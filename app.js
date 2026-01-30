// ===== FIREBASE CONFIGURATION =====
// REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIGURATION
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQPFNKQREJWscJZ54Bw54rSTpUI4fJz6M",
  authDomain: "streaky-70353.firebaseapp.com",
  projectId: "streaky-70353",
  storageBucket: "streaky-70353.firebasestorage.app",
  messagingSenderId: "549095781172",
  appId: "1:549095781172:web:2807a33a38f60809852b61",
  measurementId: "G-F4CE7TRTQ7"
};
// Initialize Firebase
console.log('🔥 Initializing Firebase...');
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
console.log('✅ Firebase initialized');

// ===== STATE =====
let currentUser = null;
let userStreaks = [];
let currentStreakDetail = null;
let appSettings = {
    dailyReminders: false,
    streakAlerts: true,
    enableAnimations: true,
    soundEffects: false
};

// ===== PREDEFINED STREAKS =====
const predefinedStreaks = [
    { name: 'Daily Coding', icon: '💻', description: 'Code every day', duration: 100 },
    { name: 'Drink Water', icon: '💧', description: 'Stay hydrated', duration: 30 },
    { name: 'Exercise', icon: '💪', description: 'Daily workout', duration: 30 },
    { name: 'Meditation', icon: '🧘', description: 'Mindfulness practice', duration: 21 },
    { name: 'Reading', icon: '📚', description: 'Read daily', duration: 30 },
    { name: 'Early Wake', icon: '☀️', description: 'Wake up early', duration: 21 }
];

// ===== DOM ELEMENTS =====
console.log('📱 Getting DOM elements...');

// Screens
const loginScreen = document.getElementById('loginScreen');
const signupScreen = document.getElementById('signupScreen');
const forgotPasswordScreen = document.getElementById('forgotPasswordScreen');
const dashboardScreen = document.getElementById('dashboardScreen');

// Login elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const showSignupBtn = document.getElementById('showSignupBtn');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

// Signup elements
const signupForm = document.getElementById('signupForm');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const signupBtn = document.getElementById('signupBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const signupError = document.getElementById('signupError');

// Forgot password elements
const forgotForm = document.getElementById('forgotForm');
const forgotEmail = document.getElementById('forgotEmail');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const backToLoginFromForgotBtn = document.getElementById('backToLoginFromForgotBtn');
const forgotError = document.getElementById('forgotError');
const forgotSuccess = document.getElementById('forgotSuccess');

// Dashboard elements
const logoutBtn = document.getElementById('logoutBtn');
const addStreakBtn = document.getElementById('addStreakBtn');
const settingsBtn = document.getElementById('settingsBtn');
const streaksContainer = document.getElementById('streaksContainer');
const emptyState = document.getElementById('emptyState');
const predefinedStreaksContainer = document.getElementById('predefinedStreaks');

// Modals
const addStreakModal = document.getElementById('addStreakModal');
const streakDetailModal = document.getElementById('streakDetailModal');
const settingsModal = document.getElementById('settingsModal');
const streakNameInput = document.getElementById('streakName');
const streakDurationInput = document.getElementById('streakDuration');
const streakDescriptionInput = document.getElementById('streakDescription');
const streakIconInput = document.getElementById('streakIcon');
const createStreakBtn = document.getElementById('createStreakBtn');
const cancelStreakBtn = document.getElementById('cancelStreakBtn');

console.log('✅ DOM elements loaded');

// ===== UTILITY FUNCTIONS =====

function showError(element, message) {
    console.log('❌ Error:', message);
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 6000);
}

function showSuccess(element, message) {
    console.log('✅ Success:', message);
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 6000);
}

function clearMessages() {
    const messages = [loginError, loginSuccess, signupError, forgotError, forgotSuccess];
    messages.forEach(msg => msg && msg.classList.remove('show'));
}

function getErrorMessage(errorCode) {
    const messages = {
        'auth/user-not-found': '❌ No account found. Please create an account first.',
        'auth/wrong-password': '❌ Incorrect password. Please try again.',
        'auth/invalid-credential': '❌ Invalid email or password. Please check and try again.',
        'auth/email-already-in-use': '❌ This email is already registered. Please sign in instead.',
        'auth/weak-password': '⚠️ Password is too weak. Please use a stronger password.',
        'auth/invalid-email': '⚠️ Invalid email address format.',
        'auth/too-many-requests': '⚠️ Too many failed attempts. Please try again later.',
        'auth/network-request-failed': '⚠️ Network error. Please check your connection.',
        'auth/popup-blocked': '⚠️ Popup was blocked. Please allow popups for this site.',
        'auth/popup-closed-by-user': '⚠️ Sign-in cancelled. Please try again.'
    };
    return messages[errorCode] || '❌ An error occurred. Please try again.';
}

// ===== SCREEN MANAGEMENT =====

function showLogin() {
    console.log('Showing login screen');
    loginScreen.classList.add('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    document.body.style.overflow = 'auto';
    clearMessages();
}

function showSignup() {
    console.log('Showing signup screen');
    loginScreen.classList.remove('active');
    signupScreen.classList.add('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    document.body.style.overflow = 'auto';
    clearMessages();
}

function showForgotPassword() {
    console.log('Showing forgot password screen');
    loginScreen.classList.remove('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
    document.body.style.overflow = 'auto';
    clearMessages();
}

function showDashboard() {
    console.log('Showing dashboard');
    loginScreen.classList.remove('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    document.body.style.overflow = 'auto';
    renderPredefinedStreaks();
}

// ===== PASSWORD TOGGLE =====

console.log('Setting up password toggles...');
document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);
        const icon = this.querySelector('.eye-icon');
        
        console.log('Password toggle clicked for:', targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }
    });
});

// ===== AUTHENTICATION =====

console.log('Setting up authentication...');

// Auth state listener
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('✅ User logged in:', user.email);
        currentUser = user;
        showDashboard();
        loadUserStreaks();
        loadSettings();
    } else {
        console.log('❌ No user logged in');
        currentUser = null;
        showLogin();
    }
});

// Login form
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        clearMessages();
        
        if (!email || !password) {
            showError(loginError, '⚠️ Please enter both email and password');
            return;
        }
        
        if (!email.includes('@')) {
            showError(loginError, '⚠️ Please enter a valid email address');
            return;
        }
        
        loginBtn.textContent = '🔄 Signing in...';
        loginBtn.disabled = true;
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            console.log('✅ Login successful');
        } catch (error) {
            console.error('❌ Login error:', error);
            showError(loginError, getErrorMessage(error.code));
            loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
        }
    });
}

// Show signup button
if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => {
        console.log('Show signup clicked');
        showSignup();
    });
}

// Forgot password button
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
        console.log('Forgot password clicked');
        showForgotPassword();
    });
}

// Back to login buttons
if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
        console.log('Back to login clicked');
        showLogin();
    });
}

if (backToLoginFromForgotBtn) {
    backToLoginFromForgotBtn.addEventListener('click', () => {
        console.log('Back to login from forgot clicked');
        showLogin();
    });
}

// Signup form
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Signup form submitted');
        
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const confirmPassword = signupConfirmPassword.value;
        
        clearMessages();
        
        if (!name) {
            showError(signupError, '⚠️ Please enter your full name');
            return;
        }
        
        if (!email || !email.includes('@')) {
            showError(signupError, '⚠️ Please enter a valid email address');
            return;
        }
        
        if (!password || password.length < 6) {
            showError(signupError, '⚠️ Password must be at least 6 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            showError(signupError, '⚠️ Passwords do not match');
            return;
        }
        
        signupBtn.textContent = '🔄 Creating account...';
        signupBtn.disabled = true;
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            console.log('✅ Account created');
            
            await userCredential.user.updateProfile({ displayName: name });
            
            try {
                await db.collection('users').doc(userCredential.user.uid).set({
                    name,
                    email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (err) {
                console.warn('Firestore write warning:', err);
            }
            
            signupName.value = '';
            signupEmail.value = '';
            signupPassword.value = '';
            signupConfirmPassword.value = '';
            
            showLogin();
            showSuccess(loginSuccess, `✅ Account created successfully! Welcome ${name}. Please sign in.`);
            emailInput.value = email;
            
        } catch (error) {
            console.error('❌ Signup error:', error);
            showError(signupError, getErrorMessage(error.code));
        } finally {
            signupBtn.textContent = 'Create Account';
            signupBtn.disabled = false;
        }
    });
}

// Forgot password form
if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Forgot password form submitted');
        
        const email = forgotEmail.value.trim();
        
        clearMessages();
        
        if (!email || !email.includes('@')) {
            showError(forgotError, '⚠️ Please enter a valid email address');
            return;
        }
        
        resetPasswordBtn.textContent = '🔄 Sending...';
        resetPasswordBtn.disabled = true;
        
        try {
            await auth.sendPasswordResetEmail(email);
            console.log('✅ Password reset email sent');
            showSuccess(forgotSuccess, '✅ Password reset link sent! Check your email.');
            forgotEmail.value = '';
            
            setTimeout(() => {
                showLogin();
            }, 3000);
            
        } catch (error) {
            console.error('❌ Password reset error:', error);
            if (error.code === 'auth/user-not-found') {
                showError(forgotError, '❌ No account found with this email');
            } else {
                showError(forgotError, getErrorMessage(error.code));
            }
        } finally {
            resetPasswordBtn.textContent = 'Send Reset Link';
            resetPasswordBtn.disabled = false;
        }
    });
}

// Google Sign In
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
        console.log('Google sign-in clicked');
        clearMessages();
        const provider = new firebase.auth.GoogleAuthProvider();
        
        googleSignInBtn.textContent = '🔄 Opening Google...';
        googleSignInBtn.disabled = true;
        
        try {
            await auth.signInWithPopup(provider);
            console.log('✅ Google sign-in successful');
        } catch (error) {
            console.error('❌ Google sign-in error:', error);
            
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                showError(loginError, '🔄 Popup blocked. Trying redirect...');
                setTimeout(() => {
                    auth.signInWithRedirect(provider);
                }, 1500);
            } else {
                showError(loginError, getErrorMessage(error.code));
                googleSignInBtn.textContent = 'Continue with Google';
                googleSignInBtn.disabled = false;
            }
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to log out?')) {
            try {
                await auth.signOut();
                console.log('✅ Logged out');
            } catch (error) {
                console.error('❌ Logout error:', error);
                alert('Logout failed: ' + error.message);
            }
        }
    });
}

// ===== PREDEFINED STREAKS =====

function renderPredefinedStreaks() {
    console.log('Rendering predefined streaks');
    if (!predefinedStreaksContainer) return;
    
    predefinedStreaksContainer.innerHTML = predefinedStreaks.map(streak => `
        <div class="predefined-card" data-streak='${JSON.stringify(streak).replace(/'/g, "&apos;")}'>
            <div class="icon">${streak.icon}</div>
            <div class="name">${streak.name}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.predefined-card').forEach(card => {
        card.addEventListener('click', () => {
            console.log('Predefined card clicked');
            const streak = JSON.parse(card.dataset.streak.replace(/&apos;/g, "'"));
            createStreakFromPredefined(streak);
        });
    });
}

async function createStreakFromPredefined(predefinedStreak) {
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    
    console.log('Creating streak from predefined:', predefinedStreak.name);
    
    try {
        const newStreak = {
            userId: currentUser.uid,
            name: predefinedStreak.name,
            icon: predefinedStreak.icon,
            description: predefinedStreak.description,
            duration: predefinedStreak.duration,
            currentStreak: 0,
            totalDays: 0,
            lastCompleted: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            completedDates: []
        };
        
        await db.collection('streaks').add(newStreak);
        console.log('✅ Streak created');
        loadUserStreaks();
    } catch (error) {
        console.error('❌ Error creating streak:', error);
        alert('Failed to create streak: ' + error.message);
    }
}

// ===== STREAK MANAGEMENT =====

async function loadUserStreaks() {
    if (!currentUser) return;
    
    console.log('Loading user streaks...');
    
    try {
        const snapshot = await db.collection('streaks')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        userStreaks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log(`✅ Loaded ${userStreaks.length} streaks`);
        renderStreaks();
    } catch (error) {
        console.error('❌ Error loading streaks:', error);
        alert('Failed to load streaks: ' + error.message);
    }
}

function renderStreaks() {
    if (!streaksContainer || !emptyState) return;
    
    console.log('Rendering streaks');
    
    if (userStreaks.length === 0) {
        streaksContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    streaksContainer.innerHTML = userStreaks.map(streak => {
        const completion = streak.duration > 0 
            ? Math.min(100, Math.round((streak.totalDays / streak.duration) * 100))
            : 0;
        
        const isCompletedToday = checkIfCompletedToday(streak);
        
        return `
            <div class="streak-card" data-streak-id="${streak.id}">
                <div class="streak-header">
                    <div class="streak-info">
                        <div class="streak-icon">${streak.icon}</div>
                        <div class="streak-name">${streak.name}</div>
                        ${streak.description ? `<div class="streak-description">${streak.description}</div>` : ''}
                    </div>
                </div>
                
                <div class="streak-stats">
                    <div class="stat">
                        <div class="stat-value">${streak.currentStreak}</div>
                        <div class="stat-label">Current</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${streak.totalDays}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${completion}%</div>
                        <div class="stat-label">Progress</div>
                    </div>
                </div>
                
                <div class="streak-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${completion}%"></div>
                    </div>
                    <div class="progress-text">${streak.totalDays} / ${streak.duration} days</div>
                </div>
                
                <div class="streak-actions">
                    <button class="btn-complete ${isCompletedToday ? 'completed' : ''}" 
                            data-streak-id="${streak.id}"
                            ${isCompletedToday ? 'disabled' : ''}>
                        ${isCompletedToday ? '✓ Completed Today' : '+ Mark Complete'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.btn-complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const streakId = btn.dataset.streakId;
            console.log('Mark complete clicked:', streakId);
            completeStreak(streakId);
        });
    });
    
    document.querySelectorAll('.streak-card').forEach(card => {
        card.addEventListener('click', () => {
            const streakId = card.dataset.streakId;
            console.log('Streak card clicked:', streakId);
            showStreakDetail(streakId);
        });
    });
}

function checkIfCompletedToday(streak) {
    if (!streak.lastCompleted) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let lastCompletedDate;
    if (streak.lastCompleted.toDate) {
        lastCompletedDate = streak.lastCompleted.toDate();
    } else {
        lastCompletedDate = new Date(streak.lastCompleted);
    }
    lastCompletedDate.setHours(0, 0, 0, 0);
    
    return today.getTime() === lastCompletedDate.getTime();
}

async function completeStreak(streakId) {
    const streak = userStreaks.find(s => s.id === streakId);
    if (!streak || checkIfCompletedToday(streak)) return;
    
    console.log('Completing streak:', streakId);
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let newCurrentStreak = streak.currentStreak + 1;
        
        if (streak.lastCompleted) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let lastCompletedDate;
            if (streak.lastCompleted.toDate) {
                lastCompletedDate = streak.lastCompleted.toDate();
            } else {
                lastCompletedDate = new Date(streak.lastCompleted);
            }
            lastCompletedDate.setHours(0, 0, 0, 0);
            
            if (lastCompletedDate.getTime() !== yesterday.getTime()) {
                newCurrentStreak = 1;
            }
        }
        
        await db.collection('streaks').doc(streakId).update({
            currentStreak: newCurrentStreak,
            totalDays: streak.totalDays + 1,
            lastCompleted: firebase.firestore.Timestamp.fromDate(today),
            completedDates: firebase.firestore.FieldValue.arrayUnion(today.toISOString())
        });
        
        console.log('✅ Streak completed');
        loadUserStreaks();
    } catch (error) {
        console.error('❌ Error completing streak:', error);
        alert('Failed to complete streak: ' + error.message);
    }
}

// ===== CUSTOM STREAK CREATION =====

if (addStreakBtn) {
    addStreakBtn.addEventListener('click', () => {
        console.log('Add streak clicked');
        openModal(addStreakModal);
    });
}

if (cancelStreakBtn) {
    cancelStreakBtn.addEventListener('click', () => {
        closeModal(addStreakModal);
    });
}

if (createStreakBtn) {
    createStreakBtn.addEventListener('click', async () => {
        const name = streakNameInput.value.trim();
        const duration = parseInt(streakDurationInput.value);
        const description = streakDescriptionInput.value.trim();
        const icon = streakIconInput.value.trim() || '🎯';
        
        if (!name) {
            alert('Please enter a streak name');
            return;
        }
        
        if (!duration || duration < 1) {
            alert('Please enter a valid duration');
            return;
        }
        
        console.log('Creating custom streak:', name);
        
        try {
            const newStreak = {
                userId: currentUser.uid,
                name,
                icon,
                description,
                duration,
                currentStreak: 0,
                totalDays: 0,
                lastCompleted: null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                completedDates: []
            };
            
            await db.collection('streaks').add(newStreak);
            console.log('✅ Custom streak created');
            
            streakNameInput.value = '';
            streakDurationInput.value = '30';
            streakDescriptionInput.value = '';
            streakIconInput.value = '🎯';
            
            closeModal(addStreakModal);
            loadUserStreaks();
        } catch (error) {
            console.error('❌ Error creating streak:', error);
            alert('Failed to create streak: ' + error.message);
        }
    });
}

// ===== STREAK DETAIL MODAL =====

function showStreakDetail(streakId) {
    const streak = userStreaks.find(s => s.id === streakId);
    if (!streak) return;
    
    console.log('Showing streak detail:', streak.name);
    currentStreakDetail = streak;
    
    document.getElementById('detailStreakName').textContent = `${streak.icon} ${streak.name}`;
    document.getElementById('detailCurrentStreak').textContent = streak.currentStreak;
    document.getElementById('detailTotalDays').textContent = streak.totalDays;
    
    const completion = streak.duration > 0 
        ? Math.min(100, Math.round((streak.totalDays / streak.duration) * 100))
        : 0;
    
    document.getElementById('detailCompletion').textContent = `${completion}%`;
    document.getElementById('detailProgressPercent').textContent = `${completion}%`;
    
    const circle = document.getElementById('detailProgressCircle');
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (completion / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    if (!document.querySelector('#gradient')) {
        const svg = circle.closest('svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
    
    document.getElementById('detailDescription').textContent = 
        streak.description || 'No description provided';
    
    openModal(streakDetailModal);
}

document.getElementById('deleteStreakBtn').addEventListener('click', async () => {
    if (!currentStreakDetail) return;
    
    if (!confirm('Are you sure you want to delete this streak?')) return;
    
    try {
        await db.collection('streaks').doc(currentStreakDetail.id).delete();
        console.log('✅ Streak deleted');
        closeModal(streakDetailModal);
        loadUserStreaks();
    } catch (error) {
        console.error('❌ Error deleting streak:', error);
        alert('Failed to delete streak: ' + error.message);
    }
});

// ===== SETTINGS =====

if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        console.log('Settings clicked');
        if (currentUser) {
            document.getElementById('settingsUserEmail').textContent = currentUser.email;
            document.getElementById('settingsUserId').textContent = 'User ID: ' + currentUser.uid.substring(0, 12) + '...';
        }
        openModal(settingsModal);
    });
}

function loadSettings() {
    const saved = localStorage.getItem('streaky-settings');
    if (saved) {
        appSettings = JSON.parse(saved);
    }
    
    document.getElementById('dailyReminders').checked = appSettings.dailyReminders;
    document.getElementById('streakAlerts').checked = appSettings.streakAlerts;
    document.getElementById('enableAnimations').checked = appSettings.enableAnimations;
    document.getElementById('soundEffects').checked = appSettings.soundEffects;
    
    if (!appSettings.enableAnimations) {
        document.body.classList.add('no-animations');
    }
}

function saveSettings() {
    localStorage.setItem('streaky-settings', JSON.stringify(appSettings));
}

document.getElementById('dailyReminders').addEventListener('change', (e) => {
    appSettings.dailyReminders = e.target.checked;
    saveSettings();
});

document.getElementById('streakAlerts').addEventListener('change', (e) => {
    appSettings.streakAlerts = e.target.checked;
    saveSettings();
});

document.getElementById('enableAnimations').addEventListener('change', (e) => {
    appSettings.enableAnimations = e.target.checked;
    saveSettings();
    document.body.classList.toggle('no-animations', !e.target.checked);
});

document.getElementById('soundEffects').addEventListener('change', (e) => {
    appSettings.soundEffects = e.target.checked;
    saveSettings();
});

document.getElementById('exportDataBtn').addEventListener('click', async () => {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('streaks')
            .where('userId', '==', currentUser.uid)
            .get();
        
        const data = {
            user: { email: currentUser.email, uid: currentUser.uid },
            streaks: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `streaky-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Data exported successfully!');
    } catch (error) {
        console.error('❌ Export error:', error);
        alert('Failed to export data: ' + error.message);
    }
});

document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete your account? This cannot be undone!')) return;
    
    const confirmation = prompt('Type "DELETE" to confirm:');
    if (confirmation !== 'DELETE') {
        alert('Account deletion cancelled');
        return;
    }
    
    try {
        const snapshot = await db.collection('streaks')
            .where('userId', '==', currentUser.uid)
            .get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        
        await db.collection('users').doc(currentUser.uid).delete();
        await currentUser.delete();
        
        alert('✅ Your account has been deleted');
    } catch (error) {
        console.error('❌ Delete account error:', error);
        alert('Failed to delete account: ' + error.message);
    }
});

// ===== MODAL UTILITIES =====

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        closeModal(overlay.closest('.modal'));
    });
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(btn.closest('.modal'));
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    }
});

// ===== INITIALIZATION =====

console.log('🚀 Streaky App Initialized');
console.log('⚠️ Remember to replace Firebase config values in app.js');
console.log('📝 All event listeners attached');