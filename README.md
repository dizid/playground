# Digital Playground

A Vue 3 web application featuring a collection of interactive mini-applications and AI-powered tools. Built with modern web technologies and deployed on Netlify.

**Live Site:** [playground.dizid.com](https://playground.dizid.com)

## Overview

This project serves as a personal digital playground for experimenting with various web technologies, third-party APIs, and AI integrations. Each tool is a self-contained mini-application showcasing different capabilities.

## Features

### 1. Grumpy AI Chat (`/grumpy-ai`)
Interactive ChatGPT conversation with 6 unique AI personas:
- **Bruce** - Grumpy, cynical old man who hates people
- **Giomoney** - Money-obsessed, incomprehensible business person
- **Marc** - Drunk and stoned personality with hearing problems
- **Alun** - Wise psychologist and guru
- **Marco** - Cheerful French speaker with English mixed in
- **Nick** - Overly positive, only speaks in affirmations

Powered by OpenAI's GPT-4o-mini model via Netlify serverless functions.

### 2. Alcohol Support Tracker (`/alcohol-help`)
Daily drink consumption tracker with context logging:
- Track daily alcohol intake
- Add notes and context for each entry
- Local storage persistence (no backend required)
- Privacy-focused (data stays in your browser)

### 3. Love Calculator (`/love`)
Fun compatibility score generator:
- Enter two names
- Get a random compatibility percentage (4-10)
- Results stored in browser cookies

### 4. Age Guesser (`/age`)
Predicts age based on first name:
- Uses [agify.io](https://agify.io) API
- Real-time age estimation
- Fun way to explore name demographics

### 5. Advice Search (`/advice`)
Random advice generator and search tool:
- Fetch random advice slips
- Search advice by keyword
- Powered by [adviceslip.com](https://api.adviceslip.com) API

### 6. Humor Generator (`/humor`)
AI-powered joke and humor generation using ChatGPT.

### 7. Funny Image Editor (`/image-editor`)
Hilarious meme and image manipulation tool:
- **Funny Effects**: Face distortion filters (big eyes, tiny mouth, invert colors, grayscale, sepia)
- **Text Overlays**: Add bold, Impact-style text with custom colors and sizes
- **Stickers & Emojis**: Browse and add 100+ funny stickers and emojis in multiple categories:
  - Faces: laughing, cool, evil, animal faces
  - Objects: party items, food, fire, stars
  - Actions: explosions, checkmarks, alerts
  - Symbols: hearts, thumbs up, hand gestures
- **Export Options**:
  - Download as PNG or JPEG
  - Copy to clipboard for quick sharing
  - Generate unique shareable links
  - Social media optimized presets (Instagram, Twitter, TikTok)

## Tech Stack

### Frontend
- **Vue 3** (v3.4.35) - Progressive JavaScript framework
- **Vue Router 4** (v4.4.3) - Official router for Vue.js
- **Vite** (v6.3.3) - Next-generation frontend build tool
- **Axios** (v1.7.3) - HTTP client for API requests
- **Vue3-Image-Editor** - Canvas-based image editing and manipulation

### Backend
- **Netlify Functions** - Serverless functions for API proxies
- **OpenAI API** (v4.55.4) - GPT-4o-mini integration
- **Node.js** - Runtime for serverless functions

### Styling
- Custom CSS with CSS variables
- Dark mode support
- Font Awesome 4.7 for icons
- Responsive design

## Project Structure

```
/home/marc/DEV/playground/
├── src/
│   ├── views/              # Page components
│   │   ├── HomeView.vue    # Landing page
│   │   ├── ChatGPT.vue     # Grumpy AI chat interface
│   │   ├── AlcoholHelp.vue # Alcohol tracker
│   │   ├── Love.vue        # Love calculator
│   │   ├── Age.vue         # Age guesser
│   │   ├── Advice.vue      # Advice search
│   │   ├── Humor.vue       # Humor generator
│   │   └── ImageEditor.vue # Funny image editor
│   ├── components/         # Reusable components
│   │   ├── FunnyEffects.vue       # Face distortion and color effects
│   │   ├── StickerLibrary.vue     # Emoji/sticker picker
│   │   └── ExportPanel.vue        # Download and share tools
│   ├── router/             # Vue Router configuration
│   ├── assets/             # CSS and static assets
│   ├── main.js            # Application entry point
│   └── App.vue            # Root component
├── netlify/
│   └── functions/         # Serverless functions
│       ├── openai-proxy.js        # ChatGPT proxy
│       ├── openai-proxy-humor.js  # Humor proxy
│       └── advice-proxy.js        # Advice API proxy
├── dist/                  # Build output
├── vite.config.js        # Vite configuration
├── netlify.toml          # Netlify deployment config
└── package.json          # Project dependencies
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (for AI features)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd playground
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
VITE_CHATGPT_APIKEY=your_openai_api_key_here
VITE_CHATGPT_ORG=your_org_id_here  # Optional
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment

This project is configured for Netlify deployment:

1. Connect your Git repository to Netlify
2. Set environment variables in Netlify dashboard:
   - `VITE_CHATGPT_APIKEY` - Your OpenAI API key
   - `VITE_CHATGPT_ORG` - Your OpenAI organization ID (optional)
3. Build settings are configured in `netlify.toml`
4. Deploy automatically on push to main branch

### Netlify Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

## Environment Variables

### Required
- `VITE_CHATGPT_APIKEY` - OpenAI API key for ChatGPT features

### Optional
- `VITE_CHATGPT_ORG` - OpenAI organization ID

## API Integrations

### External APIs
- **OpenAI GPT-4o-mini** - AI chat and humor generation
- **agify.io** - Age prediction by name
- **adviceslip.com** - Random advice and search

### Privacy & Security
- API keys are never exposed to the client
- All API calls are proxied through Netlify Functions
- User data stored locally in browser (localStorage/cookies)
- No backend database or user tracking

## Recent Updates

### v0.3 (Latest)
- New Funny Image Editor with meme creation tools
- Face distortion and color effect filters
- Emoji/sticker library with 100+ funny assets
- Export with multiple formats and social media presets
- Share links functionality

### Previous Versions
- v0.2: Major refactor of Alcohol Support Tracker
- v0.704: Added Alcohol Support Tracker
- Removed Movie Search feature (Omdb integration)
- Various bug fixes and improvements

## Development Notes

This project uses AI-assisted development (Venice.ai) for rapid prototyping and feature implementation. See `ai-prompts` file for prompts used during development.

## Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## License

This project is open source and available for educational purposes.

## Contact

- Website: [dizid.com](https://dizid.com)
- GitHub: [@dizid](https://github.com/dizid)

## Acknowledgments

- Built with Vue 3 and Vite
- Deployed on Netlify
- AI powered by OpenAI
- Icons by Font Awesome
