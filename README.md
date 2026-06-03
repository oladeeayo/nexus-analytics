# Nexus Analytics — Landing Page

A professional SaaS product analytics landing page built for the BWBMart assessment.

## Live Demo
After deploying to Vercel, your URL will appear here.

## Project Structure
```
nexus-analytics/
├── index.html              # Main landing page
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── amplitude-config.js # Amplitude initialization
│   └── main.js             # UI logic + all event tracking
├── vercel.json             # Vercel deployment config
├── .gitignore
└── README.md
```

## Amplitude Events Tracked
| Event | Properties | Purpose |
|---|---|---|
| `Page View` | path, title | Auto-tracked on load |
| `CTA Clicked` | button, section | Hero, Pricing, Bottom CTA |
| `Modal Opened` | modal | Sign Up / Demo modal open |
| `Form Submitted` | form_type, team_size | Signup & demo form |
| `Section Viewed` | section | Features, Pricing, etc. |
| `Feature Viewed` | feature | Feature card clicks |
| `Pricing Plan Viewed` | plan | Pricing card hover/click |
| `Scroll Depth Reached` | depth_percent | 25/50/75/100% |
| `Nav Clicked` | item | Navigation links |
| `Page Exit` | time_on_page_seconds | Before unload |

## Setup
1. Sign up at https://use.amplitude.com/q2rqpilrkkda
2. Create a project, copy the API key
3. Replace `REPLACE_WITH_YOUR_API_KEY` in `js/amplitude-config.js`
4. Deploy to Vercel (see below)

## Deploy to Vercel
See the full guide in the assessment notes.
