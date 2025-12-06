// Options Page Logic

const DEFAULT_SETTINGS = {
  scheduleEnabled: false,
  breakIntervalMinutes: 30,
  breakDurationMinutes: 5,
  stopAfterNextBreak: false,
  nextBreakTime: 0,
  breakActive: false
};

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    document.getElementById('break-interval').value = settings.breakIntervalMinutes;
    document.getElementById('break-duration').value = settings.breakDurationMinutes;
    document.getElementById('stop-after-break').checked = settings.stopAfterNextBreak;
    document.getElementById('schedule-enabled').checked = settings.scheduleEnabled;
  });
}

// Save settings to storage
function saveSettings() {
  const settings = {
    breakIntervalMinutes: parseInt(document.getElementById('break-interval').value),
    breakDurationMinutes: parseInt(document.getElementById('break-duration').value),
    stopAfterNextBreak: document.getElementById('stop-after-break').checked,
    scheduleEnabled: document.getElementById('schedule-enabled').checked
  };

  // Validate inputs
  if (settings.breakIntervalMinutes < 1 || settings.breakIntervalMinutes > 120) {
    alert('Break interval must be between 1 and 120 minutes');
    return;
  }

  if (settings.breakDurationMinutes < 1 || settings.breakDurationMinutes > 30) {
    alert('Break duration must be between 1 and 30 minutes');
    return;
  }

  // Save to chrome storage
  chrome.runtime.sendMessage({ 
    action: 'UPDATE_SETTINGS', 
    settings: settings 
  }, () => {
    showNotification('Settings saved successfully!');
  });
}

// Reset to default settings
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      loadSettings();
      showNotification('Settings reset to defaults!');
    });
  }
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Setup event listeners
function setupEventListeners() {
  // Save button
  document.getElementById('save-btn').addEventListener('click', saveSettings);
  
  // Reset button
  document.getElementById('reset-btn').addEventListener('click', resetSettings);
  
  // Quick preset buttons for interval
  document.querySelectorAll('.preset-btn[data-interval]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('break-interval').value = btn.dataset.interval;
    });
  });
  
  // Quick preset buttons for duration
  document.querySelectorAll('.preset-btn[data-duration]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('break-duration').value = btn.dataset.duration;
    });
  });
  
  // Auto-save on checkbox change
  document.getElementById('schedule-enabled').addEventListener('change', (e) => {
    if (e.target.checked) {
      const confirmed = confirm('Do you want to start the automatic break schedule now?');
      if (!confirmed) {
        e.target.checked = false;
      }
    }
  });
}
