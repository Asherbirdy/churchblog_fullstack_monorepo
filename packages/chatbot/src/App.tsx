import { useState } from 'react'
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
          <>
            <div className="chatbot-header">
              <div className="chatbot-header-dots" />
              <span className="chatbot-title">💬 聊天室</span>
              <button
                className="chatbot-close"
                onClick={() => setOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="chatbot-body">
              <div className="chatbot-placeholder">
                <span className="chatbot-placeholder-emoji">🐑</span>
                <p>有什麼可以幫助您的嗎？</p>
              </div>
            </div>
            <div className="chatbot-footer">
              <input
                className="chatbot-input"
                type="text"
                placeholder="輸入訊息..."
              />
              <button className="chatbot-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </>
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
