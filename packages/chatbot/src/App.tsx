import { useState } from 'react'
import './App.css'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span>聊天室</span>
            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="chatbot-body">
            <p className="chatbot-placeholder">有什麼可以幫助您的嗎？</p>
          </div>
          <div className="chatbot-footer">
            <input
              className="chatbot-input"
              type="text"
              placeholder="輸入訊息..."
            />
            <button className="chatbot-send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        className="chatbot-icon"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="開啟聊天室"
      >
        {open ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default App
