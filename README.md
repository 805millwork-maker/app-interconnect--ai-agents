# AppConnect - AI-Powered App Integration Platform

A comprehensive platform for connecting applications, deploying AI coding agents, managing GitHub Actions workflows, and enabling real-time inter-app communication.

## 🚀 Features

### 1. **App Integration Hub** (`/apps`)
- **Slot-based Architecture**: Dynamically add, remove, and manage app slots
- **Multi-app Support**: Connect various app types (Web Apps, APIs, Databases, AI Services, Storage, Analytics)
- **Real-time Status Monitoring**: Track active/inactive apps and connection counts
- **API Endpoint Configuration**: Configure and manage API endpoints for each app
- **Visual Dashboard**: Interactive grid system with app management

### 2. **AI Code Agents** (Component & `/demo`)
Expert AI agents specialized in different programming languages:
- **JavaScript/TypeScript Expert**: React, Node.js, Next.js, TypeScript, ES6+
- **HTML/CSS Specialist**: Tailwind CSS, Responsive Design, Animations, Accessibility
- **Python Developer**: Django, FastAPI, Data Science, Machine Learning
- **Solidity Blockchain Expert**: Smart Contracts, Web3, DeFi, Security Audits
- **Rust Systems Engineer**: Systems Programming, WebAssembly, Performance Optimization

Features:
- Real-time code analysis and suggestions
- Multi-language code generation
- Interactive chat interface
- Copy-to-clipboard functionality
- Context-aware responses

### 3. **GitHub Actions Integration** (`/github-actions`)
- **Workflow Templates**: Pre-built CI/CD templates for multiple languages
  - Next.js Deployment
  - Python Testing with Coverage
  - Smart Contract Security Audits
  - Rust Build & Test
  - Docker Build & Push
  - Lint & Format Checks
- **Build Monitoring**: Real-time build status tracking
- **Success Rate Analytics**: Visual metrics for build performance
- **Template Management**: Easy template discovery and deployment

### 4. **Inter-App Communication System**
Advanced WebSocket-based communication infrastructure:

#### Core Components:
- **`InterAppCommunicator`**: WebSocket client for app-to-app messaging
- **`SharedStateManager`**: Cross-app state synchronization
- **Custom React Hooks**: `useInterAppCommunication`, `useSharedState`

#### Features:
- **Message Types**: Request, Response, Broadcast, Event
- **Auto-reconnection**: Exponential backoff retry logic
- **Event Listeners**: Subscribe to specific message types
- **Shared State**: Real-time state synchronization across apps
- **Status Monitoring**: Connection status tracking

## 📁 Project Structure

```
src/
├── app/
│   ├── apps/
│   │   └── page.tsx              # App marketplace with slot management
│   ├── github-actions/
│   │   └── page.tsx              # CI/CD workflow templates & monitoring
│   ├── demo/
│   │   └── page.tsx              # Interactive demo showcasing all features
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Homepage with hero section
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Shadcn/UI components (40+ components)
│   └── AIAgentPanel.tsx          # AI coding agents component
├── hooks/
│   └── useInterAppCommunication.ts  # React hooks for communication
└── lib/
    └── inter-app-communication.ts   # Communication infrastructure
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS with custom design tokens
- **Framer Motion**: Smooth animations and transitions
- **Shadcn/UI**: 40+ pre-built accessible components

### Communication
- **WebSocket**: Real-time bidirectional communication
- **Event Bus Architecture**: Message routing and handling
- **State Management**: Shared state across connected apps

### AI Integration
- **Multi-Agent System**: Specialized agents for different languages
- **Context-Aware Responses**: Language-specific code generation
- **Interactive Chat**: Real-time conversation interface

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Package manager (npm, yarn, pnpm, or bun)

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Usage Guide

### 1. App Marketplace

**Adding an App Slot:**
1. Navigate to `/apps`
2. Click "Add Slot" to create a new empty slot
3. Click on an empty slot to configure
4. Fill in app details (name, type, description, API endpoint)
5. Click "Add App" to activate

**Managing Apps:**
- **Activate/Deactivate**: Toggle app status with the power button
- **Remove**: Delete app from slot using the trash icon
- **Monitor**: View connection counts and status in real-time

### 2. AI Code Agents

**Using the AI Agent Panel:**
1. Go to `/demo` and select the "AI Agents" tab
2. Choose a specialized agent (JS/TS, HTML/CSS, Python, Solidity, Rust)
3. Type your question or code request
4. Press Enter to send (Shift+Enter for new line)
5. Copy generated code using the "Copy" button

**Example Queries:**
- "Create a TypeScript interface for a user model"
- "Write a Python FastAPI endpoint for user authentication"
- "Generate a responsive card component with Tailwind CSS"
- "Build a Solidity smart contract for token transfers"
- "Create a Rust function for file I/O operations"

### 3. GitHub Actions

**Using Workflow Templates:**
1. Navigate to `/github-actions`
2. Browse templates by category (deployment, testing, security, quality)
3. Click "View Template" to see the YAML configuration
4. Download or copy the template to your repository's `.github/workflows/` directory

**Monitoring Builds:**
1. Switch to the "Build Monitoring" tab
2. View recent build statuses (success, failed, running, pending)
3. Check build duration and commit information
4. Access build logs by clicking "View Logs"

### 4. Inter-App Communication

**Basic Usage:**

```typescript
import { useInterAppCommunication } from '@/hooks/useInterAppCommunication';

function MyComponent() {
  const { status, sendMessage, broadcast, stateManager } = 
    useInterAppCommunication('my-app-id', true);

  // Send message to specific app
  const handleSend = () => {
    sendMessage('target-app-id', { data: 'Hello!' }, 'request');
  };

  // Broadcast to all apps
  const handleBroadcast = () => {
    broadcast({ event: 'user-login', userId: 123 });
  };

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={handleSend}>Send Message</button>
      <button onClick={handleBroadcast}>Broadcast</button>
    </div>
  );
}
```

**Shared State Management:**

```typescript
import { useSharedState } from '@/hooks/useInterAppCommunication';

function SharedStateComponent({ stateManager }) {
  const [theme, setTheme] = useSharedState(stateManager, 'app.theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light', true); // broadcast to all apps
  };

  return (
    <button onClick={toggleTheme}>
      Current Theme: {theme}
    </button>
  );
}
```

## 🎨 Design System

The platform uses a custom design system with semantic color tokens:

```css
:root {
  --color-primary: Primary brand color
  --color-secondary: Secondary actions
  --color-accent: Accent elements
  --color-muted: Muted text/backgrounds
  --color-destructive: Error states
  --color-border: Border colors
  --radius: Border radius (10px default)
}
```

Dark mode is fully supported with automatic color scheme switching.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t appconnect .

# Run container
docker run -p 3000:3000 appconnect
```

## 📊 Key Pages

- **`/`** - Homepage with feature overview and navigation
- **`/apps`** - App marketplace with slot-based management system
- **`/github-actions`** - CI/CD workflow templates and build monitoring
- **`/demo`** - Interactive demo with AI agents and live communication

## 🔐 Security Considerations

- **WebSocket Authentication**: Implement token-based authentication for production
- **Rate Limiting**: Add rate limits for API endpoints and WebSocket messages
- **Input Validation**: Validate all user inputs and app configurations
- **CORS Configuration**: Configure proper CORS policies for cross-origin requests
- **Smart Contract Audits**: Use the Solidity agent for security best practices

## 🤝 Contributing

This is a demonstration platform showcasing advanced integration patterns. To extend:

1. Add more app types in the marketplace
2. Create additional AI agent specializations
3. Expand GitHub Actions template library
4. Implement real WebSocket server backend
5. Add authentication and user management

## 📄 License

MIT License - feel free to use this platform as a foundation for your own integration systems.

---

**Built with ❤️ using Next.js 15, TypeScript, and modern web technologies**