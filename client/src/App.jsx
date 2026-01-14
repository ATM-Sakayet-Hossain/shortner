import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Layout from './components/layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App