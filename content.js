// Content Script for Break Overlay

let overlayElement = null;
let countdownInterval = null;
let breakEndTime = null;
let isShowingOverlay = false; // Flag to prevent duplicate overlays
let tipRotationInterval = null; // Interval for rotating tips
let currentTipIndex = 0; // Track which tip is currently showing

// Array of 50 different break tips
const breakTips = [
  "💡 Stand up and move around",
  "👀 Look at something 20 feet away",
  "💧 Drink some water",
  "🧘 Take a few deep breaths",
  "🤸 Do some light stretching",
  "🚶 Walk around for a bit",
  "💪 Roll your shoulders back",
  "👁️ Close your eyes and relax",
  "🙌 Stretch your arms above your head",
  "🌬️ Practice box breathing (4-4-4-4)",
  "🦵 Stand on one leg for balance",
  "🔄 Rotate your wrists and ankles",
  "😌 Massage your temples gently",
  "🏃 Do a few jumping jacks",
  "🧠 Clear your mind for a moment",
  "☀️ Look out a window at nature",
  "🎯 Focus on something in the distance",
  "💆 Relax your jaw and facial muscles",
  "🌊 Imagine a peaceful place",
  "✨ Practice gratitude - think of 3 things you're thankful for",
  "🤲 Wash your hands with cold water",
  "🎵 Listen to a calming song",
  "📖 Read a page from a book",
  "🌱 Water your plants",
  "🍎 Eat a healthy snack",
  "🧊 Apply a cold compress to your eyes",
  "🏋️ Do 10 squats or lunges",
  "👃 Practice smell awareness - notice scents around you",
  "🦶 Massage your feet",
  "🎨 Doodle or sketch for a moment",
  "📝 Write down a thought or feeling",
  "🎭 Make funny faces to relax facial muscles",
  "🤝 Hug yourself or give yourself a pat on the back",
  "🌬️ Open a window for fresh air",
  "🕯️ Light a candle or use aromatherapy",
  "📱 Put your phone away during the break",
  "🏃 March in place for 30 seconds",
  "🙏 Do a quick meditation or prayer",
  "🎪 Do some balance exercises",
  "🧘 Try a yoga pose like tree pose",
  "🌈 Think of something that makes you smile",
  "⭐ Star gaze out the window (or ceiling gaze!)",
  "🎯 Set an intention for the next work session",
  "🌻 Look at something colorful or beautiful",
  "🔊 Listen to the sounds around you mindfully",
  "🤸 Do neck rolls - 5 clockwise, 5 counter-clockwise",
  "💭 Daydream about your next vacation",
  "🧃 Have some tea or a healthy beverage",
  "🌙 Close your eyes and count backwards from 10",
  "🎈 Smile! It releases endorphins even if forced"
];

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  if (message.action === 'START_BREAK') {
    console.log('Starting break with duration:', message.duration, 'minutes');
    showBreakOverlay(message.duration);
    sendResponse({ success: true });
  } else if (message.action === 'STOP_BREAK') {
    console.log('Stopping break');
    removeBreakOverlay();
    sendResponse({ success: true });
  }
  return true;
});

// Show the break overlay
function showBreakOverlay(durationMinutes) {
  console.log('showBreakOverlay called with duration:', durationMinutes);
  
  // Prevent duplicate overlays - check if we're already showing one
  if (isShowingOverlay && overlayElement && document.body.contains(overlayElement)) {
    console.log('Overlay already showing, skipping duplicate');
    return;
  }
  
  // Remove existing overlay if any
  removeBreakOverlay();
  
  // Calculate break end time
  breakEndTime = Date.now() + (durationMinutes * 60 * 1000);
  console.log('Break end time set to:', new Date(breakEndTime));
  
  // Set flag
  isShowingOverlay = true;
  
  // Disable page scrolling
  disablePageScrolling();
  
  // Create overlay element
  overlayElement = document.createElement('div');
  overlayElement.id = 'work-rest-balance-overlay';
  overlayElement.innerHTML = `
    <div class="break-container">
      <h1 class="break-title">🌟 Break Time! 🌟</h1>
      <div class="break-message">Time to rest your eyes and stretch</div>
      <div class="countdown-timer" id="countdown-timer">
        ${formatTime(durationMinutes * 60)}
      </div>
      <div class="break-tips">
        <p id="rotating-tip">${breakTips[Math.floor(Math.random() * breakTips.length)]}</p>
      </div>
    </div>
  `;
  
  // Add overlay to page (wait for body if not ready)
  function appendOverlay() {
    if (document.body) {
      document.body.appendChild(overlayElement);
      console.log('Overlay appended to body');
      
      // Start countdown
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
      console.log('Countdown started');
      
      // Start tip rotation with random starting point
      currentTipIndex = Math.floor(Math.random() * breakTips.length);
      startTipRotation();
    } else {
      // Body not ready yet, wait a bit
      console.log('Body not ready, waiting...');
      setTimeout(appendOverlay, 10);
    }
  }
  
  appendOverlay();
}

// Remove the break overlay
function removeBreakOverlay() {
  if (overlayElement && overlayElement.parentNode) {
    overlayElement.parentNode.removeChild(overlayElement);
  }
  overlayElement = null;
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  
  if (tipRotationInterval) {
    clearInterval(tipRotationInterval);
    tipRotationInterval = null;
  }
  
  breakEndTime = null;
  isShowingOverlay = false; // Reset flag
  currentTipIndex = 0; // Reset tip index
  
  // Re-enable page scrolling
  enablePageScrolling();
}

// Update countdown timer
function updateCountdown() {
  if (!breakEndTime || !overlayElement) return;
  
  const remainingSeconds = Math.max(0, Math.floor((breakEndTime - Date.now()) / 1000));
  const timerElement = overlayElement.querySelector('#countdown-timer');
  
  if (timerElement) {
    timerElement.textContent = formatTime(remainingSeconds);
  }
  
  // Auto-remove when time is up
  if (remainingSeconds <= 0) {
    removeBreakOverlay();
  }
}

// Format seconds into MM:SS
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Start rotating tips
function startTipRotation() {
  // Rotate tips every 30 seconds
  tipRotationInterval = setInterval(() => {
    if (!overlayElement) return;
    
    // Get a random tip (different from current one)
    let newTipIndex;
    do {
      newTipIndex = Math.floor(Math.random() * breakTips.length);
    } while (newTipIndex === currentTipIndex && breakTips.length > 1);
    
    currentTipIndex = newTipIndex;
    
    const tipElement = overlayElement.querySelector('#rotating-tip');
    if (tipElement) {
      // Add fade out effect
      tipElement.style.opacity = '0';
      tipElement.style.transition = 'opacity 0.3s ease-in-out';
      
      // Change text after fade out
      setTimeout(() => {
        tipElement.textContent = breakTips[currentTipIndex];
        // Fade back in
        tipElement.style.opacity = '1';
      }, 300);
    }
  }, 30000); // Change tip every 30 seconds
  
  console.log('Tip rotation started');
}

// Check if break is active on page load - this runs immediately when ANY page loads
let checkBreakTimeout = null;
function checkBreakOnLoad() {
  // Debounce to prevent multiple rapid calls
  if (checkBreakTimeout) {
    clearTimeout(checkBreakTimeout);
  }
  
  checkBreakTimeout = setTimeout(() => {
    chrome.storage.sync.get(['breakActive', 'breakDurationMinutes', 'breakEndTime'], (settings) => {
      console.log('Content script loaded. Checking break status:', settings);
      if (settings.breakActive && settings.breakEndTime > Date.now()) {
        // Calculate remaining duration
        const remainingMs = settings.breakEndTime - Date.now();
        const remainingMinutes = remainingMs / (60 * 1000);
        console.log('Break is active! Showing overlay with', remainingMinutes, 'minutes remaining');
        showBreakOverlay(remainingMinutes);
      } else {
        console.log('No active break');
      }
    });
  }, 100); // Small delay to prevent flickering
}

// Check immediately when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkBreakOnLoad);
} else {
  // DOM is already ready
  checkBreakOnLoad();
}

// Also listen for storage changes (in case break starts while page is open)
let storageChangeTimeout = null;
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.breakActive) {
    // Debounce storage change events
    if (storageChangeTimeout) {
      clearTimeout(storageChangeTimeout);
    }
    
    storageChangeTimeout = setTimeout(() => {
      if (changes.breakActive.newValue === true) {
        // Break just started
        chrome.storage.sync.get(['breakDurationMinutes', 'breakEndTime'], (settings) => {
          const remainingMs = settings.breakEndTime - Date.now();
          const remainingMinutes = remainingMs / (60 * 1000);
          showBreakOverlay(remainingMinutes);
        });
      } else {
        // Break just stopped
        removeBreakOverlay();
      }
    }, 50); // Debounce to prevent rapid changes
  }
});

// Store original overflow values to restore later
let originalBodyOverflow = null;
let originalHtmlOverflow = null;

// Disable page scrolling
function disablePageScrolling() {
  if (document.body) {
    // Store original values
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.setProperty('overflow', 'hidden', 'important');
  }
  
  if (document.documentElement) {
    // Also set on html element for better compatibility
    originalHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
  }
  
  console.log('Page scrolling disabled');
}

// Enable page scrolling
function enablePageScrolling() {
  if (document.body) {
    // Restore original value or remove if it was empty
    if (originalBodyOverflow !== null) {
      if (originalBodyOverflow === '') {
        document.body.style.removeProperty('overflow');
      } else {
        document.body.style.overflow = originalBodyOverflow;
      }
    }
  }
  
  if (document.documentElement) {
    // Restore original value or remove if it was empty
    if (originalHtmlOverflow !== null) {
      if (originalHtmlOverflow === '') {
        document.documentElement.style.removeProperty('overflow');
      } else {
        document.documentElement.style.overflow = originalHtmlOverflow;
      }
    }
  }
  
  // Reset stored values
  originalBodyOverflow = null;
  originalHtmlOverflow = null;
  
  console.log('Page scrolling enabled');
}
