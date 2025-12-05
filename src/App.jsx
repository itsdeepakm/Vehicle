
import Register from './component/Register'
import './App.css'
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../src/component/Login";
function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </>
  )
}

export default App
