// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { BrowserRouter } from 'react-router'
// import { ChatProvider } from './contexts/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        {/* <ChatProvider> */}
          <App />
        {/* </ChatProvider> */}
      </AuthProvider>
    </BrowserRouter>
    <Toaster position='bottom-left' />
  </>
)
