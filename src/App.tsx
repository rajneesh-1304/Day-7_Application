import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login" ;
import Register from "./pages/Register/Register";
import Chat from './pages/Chat/Chat'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/chat' element={<ProtectedRoute>
          <Chat />
        </ProtectedRoute>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
