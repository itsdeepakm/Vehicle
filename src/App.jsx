
import Register from './component/Register'
import './App.css'
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../src/component/Login";
import AddVehicle from './component/AddVehicle';
import Home from "./component/Home";
function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/addvehicle" element={<AddVehicle/>}/>
      <Route path="/homepage" element={<Home/>}/>
    </Routes>
    </>
  )
}

export default App
