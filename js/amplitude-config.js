/**
 * =====================================================
 *  NEXUS ANALYTICS — AMPLITUDE CONFIGURATION
 * =====================================================
 *  Replace REPLACE_WITH_YOUR_API_KEY with your actual
 *  Amplitude API key from your project settings.
 *  You get this from: amplitude.com → Settings → Projects
 * =====================================================
 */

const AMPLITUDE_API_KEY = 'REPLACE_WITH_YOUR_API_KEY';

// ── Initialize Amplitude ─────────────────────────────
window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
window.amplitude.init(AMPLITUDE_API_KEY, {
  defaultTracking: {
    pageViews: true,      // Auto-tracks every page view
    sessions: true,       // Auto-tracks session start/end
    formInteractions: true, // Auto-tracks form events
    fileDownloads: true,
  },
  autocapture: true,
  logLevel: window.amplitude.Types.LogLevel.Warn,
});

// ── Identify user when known ─────────────────────────
// Call this when you have user data (e.g. after sign up)
function identifyUser(userId, traits = {}) {
  const identifyEvent = new window.amplitude.Identify();
  Object.entries(traits).forEach(([key, val]) => {
    identifyEvent.set(key, val);
  });
  window.amplitude.setUserId(userId);
  window.amplitude.identify(identifyEvent);
}

// ── Global event helpers ─────────────────────────────
function trackEvent(eventName, properties = {}) {
  window.amplitude.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
    page: window.location.pathname || '/',
  });
  console.log(`[Amplitude] Tracked: ${eventName}`, properties);
}

console.log('[Amplitude] Initialized for Nexus Analytics');
