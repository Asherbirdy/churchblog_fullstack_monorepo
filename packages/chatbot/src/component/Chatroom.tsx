import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
}

interface ChatroomProps {
  onClose: () => void
}

function Chatroom({ onClose }: ChatroomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    const userMessage: Message = {
      id: `${ Date.now() }`,
      text,
      sender: 'user',
    }

    setMessages((prev) => [... prev, userMessage])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <div className="chatbot-header">
        <div className="chatbot-header-dots" />
        <span className="chatbot-title">💬 聊天室</span>
        <button
          className="chatbot-close"
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="chatbot-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="chatbot-placeholder">
            <span className="chatbot-placeholder-emoji">🐑</span>
            <p>有什麼可以幫助您的嗎？</p>
          </div>
        ) : (
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-msg chatbot-msg-${ msg.sender }`}>
                <div className="chatbot-msg-bubble">{msg.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chatbot-footer">
        <input
          className="chatbot-input"
          type="text"
          placeholder="輸入訊息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chatbot-send" onClick={handleSend}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </>
  )
}

export { Chatroom }
