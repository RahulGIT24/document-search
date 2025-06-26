// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    <Toaster position='bottom-left' />
  </>
  // </StrictMode>,
)
