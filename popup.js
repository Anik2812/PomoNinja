const timerDisplay = document.querySelector('.timer-display');
const timerProgress = document.querySelector('.timer-progress');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionCount = document.getElementById('sessionCount');
const cycleType = document.getElementById('cycleType');
const quoteDisplay = document.getElementById('quoteDisplay');

let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkCycle = true;
let currentSession = 1;

const workDuration = 25 * 60;
const shortBreakDuration = 5 * 60;
const longBreakDuration = 15 * 60;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const progress = isWorkCycle ? 
        (workDuration - timeLeft) / workDuration : 
        ((isWorkCycle ? shortBreakDuration : longBreakDuration) - timeLeft) / (isWorkCycle ? shortBreakDuration : longBreakDuration);
    
    const circumference = 2 * Math.PI * 90;
    timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    timerProgress.style.strokeDashoffset = circumference * (1 - progress);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timer);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                
                if (isWorkCycle) {
                    currentSession++;
                    sessionCount.textContent = `Session: ${currentSession}`;
                    
                    if (currentSession % 4 === 0) {
                        cycleType.textContent = 'Long Break';
                        timeLeft = longBreakDuration;
                    } else {
                        cycleType.textContent = 'Short Break';
                        timeLeft = shortBreakDuration;
                    }
                } else {
                    cycleType.textContent = 'Work';
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

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkCycle = true;
    currentSession = 1;
    timeLeft = workDuration;
    cycleType.textContent = 'Work';
    sessionCount.textContent = 'Session: 1';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateTimerDisplay();
    displayRandomQuote();
}

function showNotification() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Pomodoro Timer',
        message: isWorkCycle ? 'Time for a break!' : 'Time to work!',
    });
}

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

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();
displayRandomQuote();