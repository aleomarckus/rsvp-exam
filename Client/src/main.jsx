import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './pages/login-page.jsx'
import MyEventsPage from './pages/my-events-page.jsx'
import PublicEventsPage from './pages/public-events-page.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<PublicEventsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="my" element={<MyEventsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)