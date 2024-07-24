// DOM elements
const timerDisplay = document.querySelector('.timer-display');
const timerProgress = document.querySelector('.timer-progress');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionCount = document.getElementById('sessionCount');
const totalTimeDisplay = document.getElementById('totalTime');
const cycleType = document.querySelector('.cycle-type');
const quoteDisplay = document.getElementById('quoteDisplay');
const themeSwitch = document.getElementById('themeSwitch');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');

const settingsBtn = document.getElementById('settingsBtn');
settingsBtn.addEventListener('mouseover', () => {
    settingsBtn.querySelector('i').style.animation = 'fa-spin 2s linear infinite';
});
settingsBtn.addEventListener('mouseout', () => {
    settingsBtn.querySelector('i').style.animation = 'none';
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        setTimeout(() => {
            ripple.remove();
        }, 300);
    });
});

document.querySelectorAll('input[type="range"]').forEach(input => {
    const output = document.querySelector(`output[for="${input.id}"]`);
    input.addEventListener('input', () => {
        output.textContent = input.value;
    });
});

// Timer variables
let timer;
let timeLeft;
let isRunning = false;
let isWorkCycle = true;
let currentSession = 1;
let totalSeconds = 0;

// Customizable durations (in seconds)
let workDuration = 25 * 60;
let shortBreakDuration = 5 * 60;
let longBreakDuration = 15 * 60;

// Initialize timer display
function initializeTimer() {
    timeLeft = workDuration;
    updateTimerDisplay();
    updateTotalTime();
}

// Update timer display and progress
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalDuration = isWorkCycle ? workDuration : (currentSession % 4 === 0 ? longBreakDuration : shortBreakDuration);
    
    const circumference = 2 * Math.PI * 120;
    timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    timerProgress.style.strokeDashoffset = circumference * (1 - progress);

    cycleType.textContent = isWorkCycle ? 'Work Time' : (currentSession % 4 === 0 ? 'Long Break' : 'Short Break');

    const progress = isWorkCycle ? 
        (workDuration - timeLeft) / workDuration : 
        ((isWorkCycle ? shortBreakDuration : longBreakDuration) - timeLeft) / (isWorkCycle ? shortBreakDuration : longBreakDuration);
    
    animateProgress(progress);
}

// Start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            totalSeconds++;
            updateTimerDisplay();
            updateTotalTime();
            
            if (timeLeft === 0) {
                clearInterval(timer);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                
                if (isWorkCycle) {
                    currentSession++;
                    sessionCount.textContent = `Session: ${currentSession}`;
                    
                    if (currentSession % 4 === 0) {
                        timeLeft = longBreakDuration;
                    } else {
                        timeLeft = shortBreakDuration;
                    }
                } else {
                    timeLeft = workDuration;
                }
                
                isWorkCycle = !isWorkCycle;
                updateTimerDisplay();
                showNotification();
                displayRandomQuote();
            }
        }, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkCycle = true;
    currentSession = 1;
    totalSeconds = 0;
    timeLeft = workDuration;
    sessionCount.textContent = 'Session: 1';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateTimerDisplay();
    updateTotalTime();
    displayRandomQuote();
}

// Show browser notification
function showNotification() {
    if (Notification.permission === "granted") {
        new Notification("Pomodoro Timer", {
            icon: 'icon.png',
            body: isWorkCycle ? 'Time for a break!' : 'Time to work!',
        });
    }
}

// Display a random motivational quote
function displayRandomQuote() {
    const quotes = [
        "The secret of getting ahead is getting started.",
        "Don't watch the clock; do what it does. Keep going.",
        "The only way to do great work is to love what you do.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "Believe you can and you're halfway there."
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.textContent = randomQuote;
}

// Update total time display
function updateTotalTime() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    totalTimeDisplay.textContent = `Total: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// Open settings modal
function openSettings() {
    settingsModal.style.display = 'block';
    document.getElementById('workDuration').value = workDuration / 60;
    document.getElementById('shortBreakDuration').value = shortBreakDuration / 60;
    document.getElementById('longBreakDuration').value = longBreakDuration / 60;
}

// Close settings modal
function closeSettings() {
    settingsModal.style.display = 'none';
}

// Save settings
function saveSettings() {
    workDuration = parseInt(document.getElementById('workDuration').value) * 60;
    shortBreakDuration = parseInt(document.getElementById('shortBreakDuration').value) * 60;
    longBreakDuration = parseInt(document.getElementById('longBreakDuration').value) * 60;
    
    resetTimer();
    closeSettings();
}

function animateProgress(progress) {
    const circumference = 2 * Math.PI * 140;
    const offset = circumference - (progress * circumference);
    timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    timerProgress.style.strokeDashoffset = offset;
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
themeSwitch.addEventListener('change', toggleTheme);
settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', saveSettings);

// Initialize the extension
initializeTimer();
displayRandomQuote();

// Request notification permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}