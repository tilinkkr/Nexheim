// ===== START: NODE BUILTIN SHIM (must be first) =====
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  if (typeof (window as any).global === 'undefined') (window as any).global = window;
  if (typeof (window as any).process === 'undefined') (window as any).process = { env: {} };
  if (typeof (window as any).Buffer === 'undefined') (window as any).Buffer = Buffer;
}
// ===== END SHIM =====

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
