import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// REASON: Imports the AuthProvider you had in your original file structure.
import { AuthProvider } from './components/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* REASON: Wrapping the App in AuthProvider makes the authentication context (user, login, logout) available to all components inside App. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)