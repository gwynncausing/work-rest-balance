// Background Service Worker for Break Reminder Extension

// Default settings
const DEFAULT_SETTINGS = {
  scheduleEnabled: false,
  breakIntervalMinutes: 30,
  breakDurationMinutes: 5,
  stopAfterNextBreak: false,
  nextBreakTime: 0,
  breakActive: false,
  breakEndTime: 0
};

// Initialize settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    chrome.storage.sync.set(settings);
  });
});

// Load settings and start scheduling if enabled
chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  if (settings.scheduleEnabled && settings.nextBreakTime > 0) {
    scheduleNextBreak(settings);
  }
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'START_BREAK_NOW':
      startBreakNow();
      sendResponse({ success: true });
      break;
    
    case 'STOP_BREAK':
      stopBreak();
      sendResponse({ success: true });
      break;
    
    case 'START_SCHEDULE':
      startSchedule();
      sendResponse({ success: true });
      break;
    
    case 'STOP_SCHEDULE':
      stopSchedule();
      sendResponse({ success: true });
      break;
    
    case 'GET_SETTINGS':
      chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        sendResponse(settings);
      });
      return true; // Keep channel open for async response
    
    case 'UPDATE_SETTINGS':
      updateSettings(message.settings);
      sendResponse({ success: true });
      break;
    
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  return true;
});

// Start a break immediately
function startBreakNow() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    const breakEndTime = Date.now() + (settings.breakDurationMinutes * 60 * 1000);
    
    chrome.storage.sync.set({ 
      breakActive: true,
      breakEndTime: breakEndTime
    }, () => {
      // Note: We're primarily relying on content scripts checking storage and storage change listeners
      // But we'll still try to send messages to tabs as a backup (ignore errors)
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          // Skip chrome:// and other restricted URLs
          if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'START_BREAK',
              duration: settings.breakDurationMinutes
            }).catch(() => {
              // Silently ignore - content script will pick it up from storage anyway
            });
          }
        });
      });
      
      // Schedule break end
      setTimeout(() => {
        endBreak();
      }, settings.breakDurationMinutes * 60 * 1000);
    });
  });
}

// Stop the current break
function stopBreak() {
  chrome.storage.sync.set({ 
    breakActive: false,
    breakEndTime: 0
  }, () => {
    // Send message to all tabs to remove overlay (storage listener will also handle this)
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'STOP_BREAK'
          }).catch(() => {
            // Silently ignore - storage listener will handle removal
          });
        }
      });
    });
  });
}

// End a break (called after duration expires)
function endBreak() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    stopBreak();
    
    // Check if we should stop after this break
    if (settings.stopAfterNextBreak) {
      chrome.storage.sync.set({
        scheduleEnabled: false,
        stopAfterNextBreak: false,
        nextBreakTime: 0
      });
    } else if (settings.scheduleEnabled) {
      // Schedule the next break
      scheduleNextBreak(settings);
    }
  });
}

// Start the scheduling system
function startSchedule() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    settings.scheduleEnabled = true;
    scheduleNextBreak(settings);
  });
}

// Stop the scheduling system
function stopSchedule() {
  chrome.storage.sync.set({
    scheduleEnabled: false,
    nextBreakTime: 0
  });
  chrome.alarms.clear('breakAlarm');
}

// Schedule the next break
function scheduleNextBreak(settings) {
  const nextBreakTime = Date.now() + (settings.breakIntervalMinutes * 60 * 1000);
  
  chrome.storage.sync.set({
    scheduleEnabled: true,
    nextBreakTime: nextBreakTime
  });
  
  // Use Chrome alarms API for reliable scheduling
  chrome.alarms.create('breakAlarm', {
    when: nextBreakTime
  });
}

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'breakAlarm') {
    startBreakNow();
  }
});

// Update settings
function updateSettings(newSettings) {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (currentSettings) => {
    const updatedSettings = { ...currentSettings, ...newSettings };
    chrome.storage.sync.set(updatedSettings, () => {
      // If schedule was just enabled, schedule the first break
      if (updatedSettings.scheduleEnabled && !currentSettings.scheduleEnabled) {
        scheduleNextBreak(updatedSettings);
      }
    });
  });
}

// Note: Tab listeners are kept for backup, but content scripts now self-check storage on load
// This provides redundancy in case of timing issues

// Inject overlay into newly created tabs if break is active
chrome.tabs.onCreated.addListener((tab) => {
  // Content script will check storage on load, so this is just a backup
  setTimeout(() => {
    checkAndInjectBreak(tab.id);
  }, 100);
});

// Inject overlay when tab is updated (e.g., navigation, page load)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Content script will check storage on load, so this is just a backup
  if (changeInfo.status === 'complete') {
    checkAndInjectBreak(tabId);
  }
});

// Check if break is active and inject if needed (backup mechanism)
function checkAndInjectBreak(tabId) {
  chrome.storage.sync.get(['breakActive', 'breakDurationMinutes', 'breakEndTime'], (settings) => {
    if (settings.breakActive && settings.breakEndTime > Date.now()) {
      // Calculate remaining duration
      const remainingMs = Math.max(0, settings.breakEndTime - Date.now());
      const remainingMinutes = remainingMs / (60 * 1000);
      
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          return; // Tab doesn't exist or can't be accessed
        }
        
        // Skip restricted URLs
        if (tab.url && (
          tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://') ||
          tab.url.startsWith('edge://') ||
          tab.url.startsWith('about:')
        )) {
          return; // Restricted URL
        }
        
        // Try to send message to content script (backup - content script checks storage on load)
        chrome.tabs.sendMessage(tabId, {
          action: 'START_BREAK',
          duration: remainingMinutes
        }).catch(() => {
          // Silently ignore - content script will check storage when it loads
        });
      });
    }
  });
}
