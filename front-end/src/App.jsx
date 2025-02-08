// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login } from "./routes";
import { Header } from "./components";
import "./css/index.css";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const path = window.location.pathname.split("/")[1];
  //   if (token && (path === "login" || path === "register")) {
  //     window.location.href = "/";
  //   } else if(!token && path !== "register" && path !== "login") {
  //     window.location.href = "/login";
  //   }
  // }, []);
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  );
}

export default App;
