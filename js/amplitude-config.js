// Amplitude is initialized directly in index.html via ESM
// This file kept for reference only

function trackEvent(eventName, properties = {}) {
  if (window.amplitude) {
    window.amplitude.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      page: window.location.pathname || '/',
    });
    console.log(`[Amplitude] Tracked: ${eventName}`, properties);
  }
}

function identifyUser(userId, traits = {}) {
  if (window.amplitude) {
    const identifyEvent = new window.amplitude.Identify();
    Object.entries(traits).forEach(([key, val]) => {
      identifyEvent.set(key, val);
    });
    window.amplitude.setUserId(userId);
    window.amplitude.identify(identifyEvent);
  }
}