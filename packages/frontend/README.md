# NexGuard Frontend

The React-based frontend for NexGuard, built with Vite and TailwindCSS v4.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env` (optional, defaults provided):
   ```env
   VITE_API_BASE=http://localhost:5000/api
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

## Key Components

- **AuthContext**: Manages wallet connection (CIP-30) and user state.
- **Explorer**: Main dashboard for viewing tokens.
- **MasumiChat**: AI Copilot interface.
- **MemePassport**: AI-generated identity generator.
- **TradingPanel**: Simulated DEX interface.

## Routing

Routes are defined in `App.tsx` using `react-router-dom`:
- `/`: Explorer / Home
- `/mint`: Token Minting Simulation
- `/passport`: Meme Passport
