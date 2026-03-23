import { useState } from 'react'
import { Chatroom } from './component'
import './App.css'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* SVG filter for hand-drawn wobbly edges */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="comic-rough">
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>

      <div className={`chatbot-container ${ open ? 'chatbot-open' : 'chatbot-closed' }`}>
        {open ? (
          <Chatroom onClose={() => setOpen(false)} />
        ) : (
          <button
            className="chatbot-icon"
            onClick={() => setOpen(true)}
            aria-label="開啟聊天室"
          >
            <span className="chatbot-icon-ping" />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
      </div>
    </>
  )
}

export default App
