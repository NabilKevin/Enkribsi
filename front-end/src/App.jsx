// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Register } from "./routes";
import "./css/index.css";

function App() {
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
