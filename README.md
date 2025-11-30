# 🛡️ NexGuard: Forensic Intelligence for Cardano

> **De-anonymizing the blockchain to detect insider threats, rug pulls, and hidden cabals.**

cp .env.example .env
```
*   **Optional**: Add your `BLOCKFROST_API_KEY` (for real Cardano data) and `GEMINI_API_KEY` (for AI features) to `.env`.
*   *Note: The project runs in "Mock Mode" if keys are missing.*

### 3. Run the Project
Start both the Frontend and Backend with a single command from the **root** directory:

```bash
npm run dev
```
*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend**: [http://localhost:5001](http://localhost:5001)

---

## 🏗️ Architecture & Modules

### 🖥️ Frontend (`packages/frontend`)
Built with **React**, **Vite**, and **TailwindCSS**.
*   **Policy X-Ray**: A holographic deep-dive into token metrics, trust scores, and holder distribution.
*   **Live Threat Feed**: Real-time monitoring of mempool activities.
*   **Masumi AI Chat**: Interactive AI forensic analyst for natural language audits.
*   **ZK-Whistleblower**: Interface for submitting anonymous, cryptographically verified reports.
*   **3D Visualizations**: Uses `react-three-fiber` for immersive data representation.

### ⚙️ Backend (`packages/backend`)
Built with **Node.js**, **Express**, and **SQLite**.
*   **Recursive Funding Trace**: Algorithm to link wallets to common funding sources.
*   **Risk Engine**: Calculates Trust Scores based on liquidity, holder concentration, and trading patterns.
*   **Meme Factory**: Simulates a live ecosystem of tokens for testing and demos.
*   **Masumi Agent**: Integrates Google Gemini AI for context-aware risk analysis.
*   **Database**: Auto-initialized SQLite (`audit.db`) storing tokens, reports, and audit logs.

---

## 🛠️ Technologies Used

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS v4, Framer Motion, Three.js, Lucide React |
| **Backend** | Node.js, Express, SQLite3, Axios |
| **AI & Data** | Google Gemini (Masumi Agent), Blockfrost (Cardano Data) |
| **Security** | Zero-Knowledge Proofs (Simulated Groth16), Recursive Funding Trace |

---

## 💾 Database Setup

The project uses **SQLite** for simplicity and portability.
*   **Automatic Setup**: The database (`packages/backend/audit.db`) is automatically created and initialized with tables when you start the backend.
*   **No manual migration required** for the initial setup.

---

## 🎥 Demo

[**[Insert Demo Video/Link Here]**](https://youtu.be/tPNhfBtxxYE)

---

## 🧩 Key Features Explained

1.  **Recursive Funding Trace**: Identifies "sybil" wallets by tracing where they got their ADA. If 50 wallets were funded by the same exchange account, they are treated as one entity.
2.  **Policy X-Ray**: A visual dashboard showing the "health" of a token.
3.  **Masumi AI**: An AI agent that understands on-chain data and can answer questions like "Is this token a rug pull?"
4.  **ZK-Whistleblower**: Allows insiders to report scams anonymously without revealing their identity, using cryptographic proofs.

---

## 📜 License
This project is licensed under the Apache-2.0 License.
