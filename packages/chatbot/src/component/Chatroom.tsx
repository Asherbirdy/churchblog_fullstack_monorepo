import { useState, useRef, useEffect } from 'react'
import { useMessageStore } from '../store/useMessageStore'
import { useMessageApi } from '../api'

interface ChatroomProps {
  onClose: () => void
}

function Chatroom({ onClose }: ChatroomProps) {
  const { messages, addMessage, addCardsMessage } = useMessageStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    addMessage(text, 'user')
    setInput('')
    setLoading(true)

    try {
      const { found, chatTopics } = await useMessageApi.sendMessage({ message: text })

      const cards = chatTopics
        .flatMap((topic) => topic.cards.filter((card) => card.online))
        .map(({ name, url, description }) => ({ name, url, description }))

      if (!found || cards.length === 0) {
        addMessage('抱歉，找不到相關的內容。', 'bot')
        return
      }

      addCardsMessage(cards)
    } catch {
      addMessage('發送失敗，請稍後再試。', 'bot')
    } finally {
      setLoading(false)
    }
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
        <span className="chatbot-title">💬 找找網站</span>
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
                {msg.type === 'cards' ? (
                  <div className="chatbot-cards">
                    {msg.cards.map((card, i) => (
                      <a
                        key={i}
                        className="chatbot-card"
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="chatbot-card-name">{card.name}</span>
                        {card.description && (
                          <span className="chatbot-card-desc">{card.description}</span>
                        )}
                        <span className="chatbot-card-url">{card.url}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="chatbot-msg-bubble">{msg.text}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chatbot-footer">
        <input
          className="chatbot-input"
          type="text"
          placeholder={loading ? '等待回覆中...' : '輸入訊息...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="chatbot-send" onClick={handleSend} disabled={loading}>
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
