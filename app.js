// ===== FIREBASE CONFIGURATION =====
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
const storage = firebase.storage();
console.log('✅ Firebase initialized');

// ===== STATE =====
let currentUser = null;
let userStreaks = [];
let currentStreakDetail = null;
let currentCalendarDate = new Date();
let appSettings = {
    dailyReminders: false,
    streakAlerts: true,
    enableAnimations: true,
    soundEffects: false,
    reminderTime: '09:00'
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

// Notification sound URL (leave blank for user to add)
const NOTIFICATION_SOUND_URL = 'phone-alert-marimba-bubble-om-fx-1-00-01.mp3';

// ===== DOM ELEMENTS =====
console.log('📱 Getting DOM elements...');

// Screens
const welcomeScreen = document.getElementById('welcomeScreen');
const loginScreen = document.getElementById('loginScreen');
const signupScreen = document.getElementById('signupScreen');
const forgotPasswordScreen = document.getElementById('forgotPasswordScreen');
const dashboardScreen = document.getElementById('dashboardScreen');

// Welcome
const welcomeLoginBtn = document.getElementById('welcomeLoginBtn');

// Auth elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const showSignupBtn = document.getElementById('showSignupBtn');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

const signupForm = document.getElementById('signupForm');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const signupError = document.getElementById('signupError');

const forgotForm = document.getElementById('forgotForm');
const forgotEmail = document.getElementById('forgotEmail');
const backToLoginFromForgotBtn = document.getElementById('backToLoginFromForgotBtn');
const forgotError = document.getElementById('forgotError');
const forgotSuccess = document.getElementById('forgotSuccess');

// Dashboard elements
const logoutBtn = document.getElementById('logoutBtn');
const addStreakBtn = document.getElementById('addStreakBtn');
const settingsBtn = document.getElementById('settingsBtn');
const profileBtn = document.getElementById('profileBtn');
const profileImage = document.getElementById('profileImage');
const profileInitials = document.getElementById('profileInitials');

// Stats
const totalStreaksEl = document.getElementById('totalStreaks');
const longestStreakEl = document.getElementById('longestStreak');
const completedTodayEl = document.getElementById('completedToday');
const totalDaysEl = document.getElementById('totalDays');

// Content
const predefinedStreaksContainer = document.getElementById('predefinedStreaks');
const gridView = document.getElementById('gridView');
const calendarView = document.getElementById('calendarView');
const emptyState = document.getElementById('emptyState');

// Modals
const addStreakModal = document.getElementById('addStreakModal');
const streakDetailModal = document.getElementById('streakDetailModal');
const settingsModal = document.getElementById('settingsModal');

// Toast
const toast = document.getElementById('toast');

console.log('✅ DOM elements loaded');

// ===== UTILITY FUNCTIONS =====

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    if (appSettings.soundEffects && NOTIFICATION_SOUND_URL) {
        const audio = new Audio(NOTIFICATION_SOUND_URL);
        audio.play().catch(e => console.log('Sound play failed:', e));
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

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
        'auth/user-not-found': '❌ No account found with this email',
        'auth/wrong-password': '❌ Incorrect password',
        'auth/invalid-credential': '❌ Invalid email or password',
        'auth/email-already-in-use': '❌ Email already registered',
        'auth/weak-password': '⚠️ Password must be at least 6 characters',
        'auth/invalid-email': '⚠️ Invalid email format',
        'auth/too-many-requests': '⚠️ Too many attempts. Try again later',
        'auth/network-request-failed': '⚠️ Network error. Check connection',
        'auth/popup-blocked': '⚠️ Popup blocked. Please allow popups',
        'auth/popup-closed-by-user': '⚠️ Sign-in cancelled'
    };
    return messages[errorCode] || '❌ An error occurred. Please try again';
}

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ===== SCREEN MANAGEMENT =====

function showWelcome() {
    console.log('Showing welcome screen');
    welcomeScreen.classList.add('active');
    loginScreen.classList.remove('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    clearMessages();
}

function showLogin() {
    console.log('Showing login screen');
    welcomeScreen.classList.remove('active');
    loginScreen.classList.add('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    clearMessages();
}

function showSignup() {
    console.log('Showing signup screen');
    welcomeScreen.classList.remove('active');
    loginScreen.classList.remove('active');
    signupScreen.classList.add('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    clearMessages();
}

function showForgotPassword() {
    console.log('Showing forgot password screen');
    welcomeScreen.classList.remove('active');
    loginScreen.classList.remove('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
    clearMessages();
}

function showDashboard() {
    console.log('Showing dashboard');
    welcomeScreen.classList.remove('active');
    loginScreen.classList.remove('active');
    signupScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    renderPredefinedStreaks();
    updateStats();
}

// ===== WELCOME SCREEN =====

if (welcomeLoginBtn) {
    welcomeLoginBtn.addEventListener('click', () => showLogin());
}

// ===== PASSWORD TOGGLE =====

document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);
        const icon = this.querySelector('.eye-icon');
        
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

auth.onAuthStateChanged(async user => {
    if (user) {
        console.log('✅ User logged in:', user.email);
        currentUser = user;
        
        // Set profile image/initials
        updateProfileDisplay();
        
        showDashboard();
        await loadUserStreaks();
        loadSettings();
        setupDailyReminder();
    } else {
        console.log('❌ No user logged in');
        currentUser = null;
        
        // Check if first visit
        const hasVisited = localStorage.getItem('streaky-visited');
        if (!hasVisited) {
            showWelcome();
            localStorage.setItem('streaky-visited', 'true');
        } else {
            showLogin();
        }
    }
});

// Update profile display
function updateProfileDisplay() {
    if (!currentUser) return;
    
    const photoURL = currentUser.photoURL;
    const displayName = currentUser.displayName || currentUser.email;
    
    if (photoURL) {
        profileImage.src = photoURL;
        profileImage.style.display = 'block';
        profileInitials.style.display = 'none';
    } else {
        profileImage.style.display = 'none';
        profileInitials.style.display = 'flex';
        profileInitials.textContent = getInitials(displayName);
    }
}

// Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        clearMessages();
        
        if (!email || !password) {
            showError(loginError, '⚠️ Please enter email and password');
            return;
        }
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '🔄 Signing in...';
        submitBtn.disabled = true;
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            showToast('✅ Welcome back!', 'success');
        } catch (error) {
            console.error('❌ Login error:', error);
            showError(loginError, getErrorMessage(error.code));
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => showSignup());
}

if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => showForgotPassword());
}

if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => showLogin());
}

if (backToLoginFromForgotBtn) {
    backToLoginFromForgotBtn.addEventListener('click', () => showLogin());
}

// Signup
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const confirmPassword = signupConfirmPassword.value;
        
        clearMessages();
        
        if (!name) {
            showError(signupError, '⚠️ Please enter your name');
            return;
        }
        
        if (!email || !email.includes('@')) {
            showError(signupError, '⚠️ Please enter a valid email');
            return;
        }
        
        if (!password || password.length < 6) {
            showError(signupError, '⚠️ Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            showError(signupError, '⚠️ Passwords do not match');
            return;
        }
        
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '🔄 Creating account...';
        submitBtn.disabled = true;
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: name });
            
            // Save user data
            try {
                await db.collection('users').doc(userCredential.user.uid).set({
                    name,
                    email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (err) {
                console.warn('Firestore write warning:', err);
            }
            
            signupForm.reset();
            showToast('✅ Account created successfully! Welcome to Streaky!', 'success');
            
        } catch (error) {
            console.error('❌ Signup error:', error);
            showError(signupError, getErrorMessage(error.code));
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Forgot password
if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = forgotEmail.value.trim();
        
        clearMessages();
        
        if (!email || !email.includes('@')) {
            showError(forgotError, '⚠️ Please enter a valid email');
            return;
        }
        
        const submitBtn = forgotForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '🔄 Sending...';
        submitBtn.disabled = true;
        
        try {
            await auth.sendPasswordResetEmail(email);
            showSuccess(forgotSuccess, '✅ Password reset link sent! Check your email');
            forgotEmail.value = '';
            
            setTimeout(() => showLogin(), 3000);
            
        } catch (error) {
            console.error('❌ Password reset error:', error);
            showError(forgotError, getErrorMessage(error.code));
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Google Sign In
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
        clearMessages();
        const provider = new firebase.auth.GoogleAuthProvider();
        
        const originalText = googleSignInBtn.innerHTML;
        googleSignInBtn.textContent = '🔄 Opening Google...';
        googleSignInBtn.disabled = true;
        
        try {
            const result = await auth.signInWithPopup(provider);
            
            // Save/update user profile photo from Google
            if (result.user.photoURL) {
                try {
                    await db.collection('users').doc(result.user.uid).set({
                        photoURL: result.user.photoURL,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                } catch (err) {
                    console.warn('Profile photo save warning:', err);
                }
            }
            
            showToast('✅ Signed in with Google!', 'success');
        } catch (error) {
            console.error('❌ Google sign-in error:', error);
            
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                showError(loginError, '🔄 Popup blocked. Trying redirect...');
                setTimeout(() => auth.signInWithRedirect(provider), 1500);
            } else {
                showError(loginError, getErrorMessage(error.code));
            }
        } finally {
            googleSignInBtn.innerHTML = originalText;
            googleSignInBtn.disabled = false;
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to log out?')) {
            try {
                await auth.signOut();
                showToast('👋 Logged out successfully', 'success');
            } catch (error) {
                console.error('❌ Logout error:', error);
                showToast('❌ Logout failed', 'error');
            }
        }
    });
}

// ===== PREDEFINED STREAKS =====

function renderPredefinedStreaks() {
    if (!predefinedStreaksContainer) return;
    
    predefinedStreaksContainer.innerHTML = predefinedStreaks.map(streak => `
        <div class="predefined-card" data-streak='${JSON.stringify(streak).replace(/'/g, "&apos;")}'>
            <div class="icon">${streak.icon}</div>
            <div class="name">${streak.name}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.predefined-card').forEach(card => {
        card.addEventListener('click', () => {
            const streak = JSON.parse(card.dataset.streak.replace(/&apos;/g, "'"));
            createStreakFromPredefined(streak);
        });
    });
}

async function createStreakFromPredefined(predefinedStreak) {
    if (!currentUser) {
        showToast('❌ Please log in first', 'error');
        return;
    }
    
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
        showToast(`✅ ${predefinedStreak.name} streak created!`, 'success');
        await loadUserStreaks();
    } catch (error) {
        console.error('❌ Error creating streak:', error);
        showToast('❌ Failed to create streak', 'error');
    }
}

// ===== STREAK MANAGEMENT =====

async function loadUserStreaks() {
    if (!currentUser) return;
    
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
        updateStats();
    } catch (error) {
        console.error('❌ Error loading streaks:', error);
        showToast('❌ Failed to load streaks', 'error');
    }
}

function updateStats() {
    if (!currentUser) return;
    
    const total = userStreaks.length;
    const longest = Math.max(0, ...userStreaks.map(s => s.currentStreak));
    const completedToday = userStreaks.filter(s => checkIfCompletedToday(s)).length;
    const totalDays = userStreaks.reduce((sum, s) => sum + s.totalDays, 0);
    
    if (totalStreaksEl) totalStreaksEl.textContent = total;
    if (longestStreakEl) longestStreakEl.textContent = longest;
    if (completedTodayEl) completedTodayEl.textContent = completedToday;
    if (totalDaysEl) totalDaysEl.textContent = totalDays;
}

function renderStreaks() {
    if (!gridView || !emptyState) return;
    
    if (userStreaks.length === 0) {
        gridView.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    
    gridView.innerHTML = userStreaks.map(streak => {
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
                    <div class="streak-stat">
                        <div class="streak-stat-value">${streak.currentStreak}</div>
                        <div class="streak-stat-label">Current</div>
                    </div>
                    <div class="streak-stat">
                        <div class="streak-stat-value">${streak.totalDays}</div>
                        <div class="streak-stat-label">Total</div>
                    </div>
                    <div class="streak-stat">
                        <div class="streak-stat-value">${completion}%</div>
                        <div class="streak-stat-label">Progress</div>
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
                        ${isCompletedToday ? '✓ Completed Today' : '✓ Mark Complete'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.btn-complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const streakId = btn.dataset.streakId;
            completeStreak(streakId);
        });
    });
    
    document.querySelectorAll('.streak-card').forEach(card => {
        card.addEventListener('click', () => {
            const streakId = card.dataset.streakId;
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
        
        // Celebrate milestones
        if (appSettings.streakAlerts) {
            if (newCurrentStreak === 7) {
                showToast('🎉 Amazing! 7 day streak!', 'success');
            } else if (newCurrentStreak === 30) {
                showToast('🔥 Incredible! 30 day streak!', 'success');
            } else if (newCurrentStreak === 100) {
                showToast('🏆 LEGENDARY! 100 day streak!', 'success');
            } else {
                showToast(`✅ ${streak.name} completed! ${newCurrentStreak} day streak 🔥`, 'success');
            }
        } else {
            showToast(`✅ ${streak.name} completed!`, 'success');
        }
        
        await loadUserStreaks();
    } catch (error) {
        console.error('❌ Error completing streak:', error);
        showToast('❌ Failed to complete streak', 'error');
    }
}

// ===== VIEW TOGGLE =====

document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        
        // Update active state
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Toggle views
        if (view === 'grid') {
            gridView.style.display = 'grid';
            calendarView.style.display = 'none';
        } else if (view === 'calendar') {
            gridView.style.display = 'none';
            calendarView.style.display = 'block';
            renderCalendar();
        }
    });
});

// ===== CALENDAR VIEW =====

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthEl = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthEl) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Set month title
    currentMonthEl.textContent = currentCalendarDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= totalDays; day++) {
        const dayDate = new Date(year, month, day);
        dayDate.setHours(0, 0, 0, 0);
        
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        if (dayDate.getTime() === today.getTime()) {
            dayCell.classList.add('today');
        }
        
        // Get completed streaks for this day
        const completedStreaksThisDay = userStreaks.filter(streak => {
            if (!streak.completedDates || !Array.isArray(streak.completedDates)) return false;
            return streak.completedDates.some(dateStr => {
                const completedDate = new Date(dateStr);
                completedDate.setHours(0, 0, 0, 0);
                return completedDate.getTime() === dayDate.getTime();
            });
        });
        
        dayCell.innerHTML = `
            <div class="day-number">${day}</div>
            <div class="day-dots">
                ${completedStreaksThisDay.map(() => '<div class="day-dot"></div>').join('')}
            </div>
        `;
        
        calendarGrid.appendChild(dayCell);
    }
}

// Calendar navigation
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });
}

if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });
}

// ===== ADD STREAK MODAL =====

if (addStreakBtn) {
    addStreakBtn.addEventListener('click', () => openModal(addStreakModal));
}

// Icon picker
const iconOptions = document.querySelectorAll('.icon-option');
const streakIconInput = document.getElementById('streakIcon');

iconOptions.forEach(option => {
    option.addEventListener('click', () => {
        iconOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        if (streakIconInput) {
            streakIconInput.value = option.dataset.icon;
        }
    });
});

const createStreakBtn = document.getElementById('createStreakBtn');
const cancelStreakBtn = document.getElementById('cancelStreakBtn');

if (cancelStreakBtn) {
    cancelStreakBtn.addEventListener('click', () => closeModal(addStreakModal));
}

if (createStreakBtn) {
    createStreakBtn.addEventListener('click', async () => {
        const name = document.getElementById('streakName').value.trim();
        const duration = parseInt(document.getElementById('streakDuration').value);
        const description = document.getElementById('streakDescription').value.trim();
        const icon = document.getElementById('streakIcon').value.trim() || '🎯';
        
        if (!name) {
            showToast('⚠️ Please enter a streak name', 'error');
            return;
        }
        
        if (!duration || duration < 1) {
            showToast('⚠️ Please enter a valid duration', 'error');
            return;
        }
        
        createStreakBtn.disabled = true;
        createStreakBtn.textContent = '🔄 Creating...';
        
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
            showToast(`✅ ${name} streak created!`, 'success');
            
            // Reset form
            document.getElementById('streakName').value = '';
            document.getElementById('streakDuration').value = '30';
            document.getElementById('streakDescription').value = '';
            document.getElementById('streakIcon').value = '🎯';
            iconOptions.forEach(opt => opt.classList.remove('selected'));
            
            closeModal(addStreakModal);
            await loadUserStreaks();
        } catch (error) {
            console.error('❌ Error creating streak:', error);
            showToast('❌ Failed to create streak', 'error');
        } finally {
            createStreakBtn.disabled = false;
            createStreakBtn.textContent = 'Create Streak';
        }
    });
}

// ===== STREAK DETAIL MODAL =====

function showStreakDetail(streakId) {
    const streak = userStreaks.find(s => s.id === streakId);
    if (!streak) return;
    
    currentStreakDetail = streak;
    
    document.getElementById('detailStreakName').textContent = `${streak.icon} ${streak.name}`;
    document.getElementById('detailCurrentStreak').textContent = streak.currentStreak;
    document.getElementById('detailTotalDays').textContent = streak.totalDays;
    document.getElementById('detailTargetDays').textContent = streak.duration;
    
    const completion = streak.duration > 0 
        ? Math.min(100, Math.round((streak.totalDays / streak.duration) * 100))
        : 0;
    
    document.getElementById('detailProgressPercent').textContent = `${completion}%`;
    
    // Update progress ring
    const circle = document.getElementById('detailProgressCircle');
    if (circle) {
        const radius = 85;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (completion / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    const descEl = document.getElementById('detailDescription');
    if (descEl) {
        descEl.textContent = streak.description || 'No description provided';
    }
    
    openModal(streakDetailModal);
}

const deleteStreakBtn = document.getElementById('deleteStreakBtn');
if (deleteStreakBtn) {
    deleteStreakBtn.addEventListener('click', async () => {
        if (!currentStreakDetail) return;
        
        if (!confirm(`Are you sure you want to delete "${currentStreakDetail.name}"? This cannot be undone.`)) return;
        
        deleteStreakBtn.disabled = true;
        deleteStreakBtn.textContent = '🔄 Deleting...';
        
        try {
            await db.collection('streaks').doc(currentStreakDetail.id).delete();
            showToast(`✅ ${currentStreakDetail.name} deleted`, 'success');
            closeModal(streakDetailModal);
            await loadUserStreaks();
        } catch (error) {
            console.error('❌ Error deleting streak:', error);
            showToast('❌ Failed to delete streak', 'error');
        } finally {
            deleteStreakBtn.disabled = false;
            deleteStreakBtn.textContent = 'Delete Streak';
        }
    });
}

// ===== SETTINGS =====

if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        if (currentUser) {
            document.getElementById('settingsUserEmail').textContent = currentUser.email;
            document.getElementById('settingsUserId').textContent = 'ID: ' + currentUser.uid.substring(0, 12) + '...';
            
            // Update profile photo in settings
            const settingsProfileImage = document.getElementById('settingsProfileImage');
            const settingsProfileInitials = document.getElementById('settingsProfileInitials');
            
            if (currentUser.photoURL) {
                settingsProfileImage.src = currentUser.photoURL;
                settingsProfileImage.style.display = 'block';
                settingsProfileInitials.style.display = 'none';
            } else {
                settingsProfileImage.style.display = 'none';
                settingsProfileInitials.style.display = 'flex';
                settingsProfileInitials.textContent = getInitials(currentUser.displayName || currentUser.email);
            }
        }
        openModal(settingsModal);
    });
}

// Profile button click
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        settingsBtn.click();
    });
}

function loadSettings() {
    const saved = localStorage.getItem('streaky-settings');
    if (saved) {
        appSettings = { ...appSettings, ...JSON.parse(saved) };
    }
    
    document.getElementById('dailyReminders').checked = appSettings.dailyReminders;
    document.getElementById('streakAlerts').checked = appSettings.streakAlerts;
    document.getElementById('enableAnimations').checked = appSettings.enableAnimations;
    document.getElementById('soundEffects').checked = appSettings.soundEffects;
    document.getElementById('reminderTime').value = appSettings.reminderTime;
    
    if (!appSettings.enableAnimations) {
        document.body.classList.add('no-animations');
    }
    
    // Show/hide reminder time
    toggleReminderTimeSection();
}

function saveSettings() {
    localStorage.setItem('streaky-settings', JSON.stringify(appSettings));
}

function toggleReminderTimeSection() {
    const section = document.getElementById('reminderTimeSection');
    if (section) {
        section.style.display = appSettings.dailyReminders ? 'flex' : 'none';
    }
}

// Settings event listeners
document.getElementById('dailyReminders').addEventListener('change', (e) => {
    appSettings.dailyReminders = e.target.checked;
    saveSettings();
    toggleReminderTimeSection();
    setupDailyReminder();
    showToast(e.target.checked ? '🔔 Daily reminders enabled' : '🔕 Daily reminders disabled', 'success');
});

document.getElementById('streakAlerts').addEventListener('change', (e) => {
    appSettings.streakAlerts = e.target.checked;
    saveSettings();
    showToast(e.target.checked ? '🎉 Streak alerts enabled' : '📴 Streak alerts disabled', 'success');
});

document.getElementById('enableAnimations').addEventListener('change', (e) => {
    appSettings.enableAnimations = e.target.checked;
    saveSettings();
    document.body.classList.toggle('no-animations', !e.target.checked);
    showToast(e.target.checked ? '✨ Animations enabled' : '⏸️ Animations disabled', 'success');
});

document.getElementById('soundEffects').addEventListener('change', (e) => {
    appSettings.soundEffects = e.target.checked;
    saveSettings();
    showToast(e.target.checked ? '🔊 Sound effects enabled' : '🔇 Sound effects disabled', 'success');
});

document.getElementById('reminderTime').addEventListener('change', (e) => {
    appSettings.reminderTime = e.target.value;
    saveSettings();
    setupDailyReminder();
    showToast('⏰ Reminder time updated', 'success');
});

// Profile photo upload
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const profilePhotoInput = document.getElementById('profilePhotoInput');
const removePhotoBtn = document.getElementById('removePhotoBtn');

if (uploadPhotoBtn && profilePhotoInput) {
    uploadPhotoBtn.addEventListener('click', () => {
        profilePhotoInput.click();
    });
    
    profilePhotoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('⚠️ Image must be less than 5MB', 'error');
            return;
        }
        
        uploadPhotoBtn.disabled = true;
        uploadPhotoBtn.textContent = '🔄 Uploading...';
        
        try {
            // Upload to Firebase Storage
            const storageRef = storage.ref();
            const photoRef = storageRef.child(`profile-photos/${currentUser.uid}/${Date.now()}_${file.name}`);
            await photoRef.put(file);
            
            // Get download URL
            const photoURL = await photoRef.getDownloadURL();
            
            // Update user profile
            await currentUser.updateProfile({ photoURL });
            
            // Save to Firestore
            await db.collection('users').doc(currentUser.uid).set({
                photoURL
            }, { merge: true });
            
            updateProfileDisplay();
            showToast('✅ Profile photo updated!', 'success');
            
            // Refresh settings modal
            settingsBtn.click();
            setTimeout(() => settingsBtn.click(), 100);
            
        } catch (error) {
            console.error('❌ Error uploading photo:', error);
            showToast('❌ Failed to upload photo', 'error');
        } finally {
            uploadPhotoBtn.disabled = false;
            uploadPhotoBtn.textContent = 'Upload Photo';
            profilePhotoInput.value = '';
        }
    });
}

if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', async () => {
        if (!confirm('Remove profile photo?')) return;
        
        try {
            await currentUser.updateProfile({ photoURL: null });
            await db.collection('users').doc(currentUser.uid).update({
                photoURL: firebase.firestore.FieldValue.delete()
            });
            
            updateProfileDisplay();
            showToast('✅ Profile photo removed', 'success');
            
            // Refresh settings modal
            settingsBtn.click();
            setTimeout(() => settingsBtn.click(), 100);
            
        } catch (error) {
            console.error('❌ Error removing photo:', error);
            showToast('❌ Failed to remove photo', 'error');
        }
    });
}

// Export data
document.getElementById('exportDataBtn').addEventListener('click', async () => {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('streaks')
            .where('userId', '==', currentUser.uid)
            .get();
        
        const data = {
            user: { 
                email: currentUser.email, 
                uid: currentUser.uid,
                displayName: currentUser.displayName
            },
            streaks: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            settings: appSettings,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `streaky-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('✅ Data exported successfully!', 'success');
    } catch (error) {
        console.error('❌ Export error:', error);
        showToast('❌ Failed to export data', 'error');
    }
});

// Delete account
document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    if (!currentUser) return;
    
    if (!confirm('⚠️ Are you sure you want to delete your account? This CANNOT be undone!')) return;
    
    const confirmation = prompt('Type "DELETE" to confirm:');
    if (confirmation !== 'DELETE') {
        showToast('Account deletion cancelled', 'error');
        return;
    }
    
    try {
        // Delete all streaks
        const snapshot = await db.collection('streaks')
            .where('userId', '==', currentUser.uid)
            .get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        
        // Delete user document
        await db.collection('users').doc(currentUser.uid).delete();
        
        // Delete auth account
        await currentUser.delete();
        
        showToast('✅ Account deleted', 'success');
    } catch (error) {
        console.error('❌ Delete account error:', error);
        showToast('❌ Failed to delete account. You may need to re-login first.', 'error');
    }
});

// ===== DAILY REMINDER =====

function setupDailyReminder() {
    if (!appSettings.dailyReminders) return;
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Check daily for incomplete streaks
    const checkReminder = () => {
        const now = new Date();
        const [hours, minutes] = appSettings.reminderTime.split(':');
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // If it's reminder time and we have incomplete streaks
        if (Math.abs(now - reminderTime) < 60000) { // Within 1 minute
            const incomplete = userStreaks.filter(s => !checkIfCompletedToday(s));
            
            if (incomplete.length > 0 && Notification.permission === 'granted') {
                new Notification('Streaky Reminder 🔥', {
                    body: `You have ${incomplete.length} streak${incomplete.length > 1 ? 's' : ''} to complete today!`,
                    icon: '/path/to/icon.png' // Add your icon path
                });
            }
        }
    };
    
    // Check every minute
    setInterval(checkReminder, 60000);
}

// ===== MODAL UTILITIES =====

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
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

console.log('🚀 Streaky App v2.0 Initialized');
console.log('✨ Features: Calendar View, Profile Photos, Real-time Settings, Notifications');
