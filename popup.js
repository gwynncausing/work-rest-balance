// Popup UI Logic

let updateInterval = null;

// Load and display current state
function updatePopupState() {
  chrome.runtime.sendMessage({ action: 'GET_SETTINGS' }, (settings) => {
    if (!settings) return;
    
    const statusBadge = document.getElementById('status-badge');
    const startBreakBtn = document.getElementById('start-break-btn');
    const stopBreakBtn = document.getElementById('stop-break-btn');
    const startScheduleBtn = document.getElementById('start-schedule-btn');
    const stopScheduleBtn = document.getElementById('stop-schedule-btn');
    const nextBreakContainer = document.getElementById('next-break-container');
    const breakActiveContainer = document.getElementById('break-active-container');
    const nextBreakTime = document.getElementById('next-break-time');
    
    // Update status badge
    if (settings.breakActive) {
      statusBadge.textContent = 'Break Active';
      statusBadge.classList.add('active');
      startBreakBtn.classList.add('hidden');
      stopBreakBtn.classList.remove('hidden');
      nextBreakContainer.classList.add('hidden');
      breakActiveContainer.classList.remove('hidden');
      
      // Calculate and display time until break ends
      if (settings.breakEndTime > 0) {
        const remaining = Math.max(0, settings.breakEndTime - Date.now());
        const breakRemainingTime = document.getElementById('break-remaining-time');
        if (breakRemainingTime) {
          breakRemainingTime.textContent = formatTime(Math.floor(remaining / 1000));
        }
      }
    } else if (settings.scheduleEnabled) {
      statusBadge.textContent = 'Schedule Running';
      statusBadge.classList.add('active');
      startBreakBtn.classList.remove('hidden');
      stopBreakBtn.classList.add('hidden');
      nextBreakContainer.classList.remove('hidden');
      breakActiveContainer.classList.add('hidden');
      
      // Calculate and display time until next break
      if (settings.nextBreakTime > 0) {
        const remaining = Math.max(0, settings.nextBreakTime - Date.now());
        nextBreakTime.textContent = formatTime(Math.floor(remaining / 1000));
      }
    } else {
      statusBadge.textContent = 'Idle';
      statusBadge.classList.remove('active');
      startBreakBtn.classList.remove('hidden');
      stopBreakBtn.classList.add('hidden');
      nextBreakContainer.classList.add('hidden');
      breakActiveContainer.classList.add('hidden');
    }
    
    // Update schedule button
    if (settings.scheduleEnabled) {
      startScheduleBtn.classList.add('hidden');
      stopScheduleBtn.classList.remove('hidden');
    } else {
      startScheduleBtn.classList.remove('hidden');
      stopScheduleBtn.classList.add('hidden');
    }
  });
}

// Format seconds into MM:SS or HH:MM:SS
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Event listeners
document.getElementById('start-break-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'START_BREAK_NOW' }, () => {
    updatePopupState();
  });
});

document.getElementById('stop-break-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'STOP_BREAK' }, () => {
    updatePopupState();
  });
});

document.getElementById('start-schedule-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'START_SCHEDULE' }, () => {
    updatePopupState();
  });
});

document.getElementById('stop-schedule-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'STOP_SCHEDULE' }, () => {
    updatePopupState();
  });
});

document.getElementById('settings-link').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Update state on load
updatePopupState();

// Update every second
updateInterval = setInterval(updatePopupState, 1000);

// Clean up on unload
window.addEventListener('unload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
