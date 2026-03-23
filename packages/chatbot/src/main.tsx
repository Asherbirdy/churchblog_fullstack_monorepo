import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'

const CONTAINER_ID = 'chatbot-oqa-root'

function init() {
  let container = document.getElementById(CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = CONTAINER_ID
    document.body.appendChild(container)
  }

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { init }

type ChatbotOQA = Record<string, unknown>
;(window as unknown as ChatbotOQA).ChatbotOQA = { init }
