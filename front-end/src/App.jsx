// import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./pages/Public";
import { Addphoto, Home, PrivateLayout, Statistics } from "./pages/Private";
import { Header, Loading } from "./components";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/header/index.css";
import "./css/main.css";
import { BASE_URL_API } from "./config";

function App() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [isHomepage, setIsHomepage] = useState(false)
  const [loading, setLoading] = useState(true)
  const path = location.pathname.split('/')[1]
  const [user, setUser] = useState()
  const [showNotificationButton, setShowNotificationButton] = useState()

  const check_auth = async () => {
    
    try {
      const response = await axios.get(`${BASE_URL_API}/me`)
      if(response.status === 200) {
        if(path === 'login' || response.data.user?.face_img && path === 'addphoto') {
          navigate('/')
          setIsHomepage(true)
        }
        
        if(!response.data.user?.face_img) {
          navigate('/addphoto')
          setIsHomepage(false)
        }
      }
      
      setUser(response.data.user)
    } catch {
      if(path !== 'login') {
        navigate('/login')
        setIsHomepage(false)
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1)
    }
  }
  
  useEffect(() => {
    if(path === '') {
      setIsHomepage(true)
    }
    check_auth()
  }, [])
  return (
    <>
    { loading && <Loading /> }
    <Header isHomepage={isHomepage} user={user} showNotificationButton={showNotificationButton} />

    {
      !loading && 
        <Routes>
          <Route path="/" element={
            <PrivateLayout>
              <Home setShowNotificationButton={setShowNotificationButton} />
            </PrivateLayout>
          } />
          <Route path="/statistics" element={
            <PrivateLayout>
              <Statistics setShowNotificationButton={setShowNotificationButton} />
            </PrivateLayout>
          } />
          <Route path="/addphoto" element={
            <Addphoto check_auth={check_auth} setLoading={setLoading} />
          } />

          <Route path="/login" element={
            <Login check_auth={check_auth} setLoading={setLoading} />
          } />
        </Routes>    
    }
    </>
  );
}

export default App;
