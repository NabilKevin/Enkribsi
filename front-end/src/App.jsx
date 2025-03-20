/* eslint-disable react-hooks/exhaustive-deps */
// import { useState } from "react";
import { Addphoto, Home, PrivateLayout, Statistics, Absen, Notifications, Notification } from "./pages/Private";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleOutPopup, handleClickOutside } from '@/utils/Popup';
import { API_ENDPOINTS, BASE_URL_API } from "./config";
import { Header, Loading, Popup } from "./components";
import { Login, NotFound } from "./pages/Public";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import "./css/header/index.css";
import "./css/main.css";
import Profile from "./pages/Private/User/Profile";
import Permit from "./pages/Private/User/Permit";
import ForgotPassword from "./pages/Private/User/ForgotPassword";


function App() {
  return (
  <ForgotPassword />
  )
  axios.defaults.withCredentials = true;

  const [showNotificationButton, setShowNotificationButton] = useState()
  const [isLongClicked, setIsLongClicked] = useState(false)
  const [isHomepage, setIsHomepage] = useState(false)
  const [showPopup, setShowPopup] = useState({show: false, slide: 'in', title: '', content: ''})
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  const popupRef = useRef(null)

  const path = location.pathname.split('/')[1]

  const shouldNavigateToHome = (user) => {
    return path === 'login' || (user?.face_img && path === 'addphoto');
  };
  
  const handleErrorNavigation = () => {
    if(path !== 'login') {
      location.replace('/login');
    }
  };
  const handleSuccessNavigation = (response) => {
    const user = response.data.user;
  
    if (shouldNavigateToHome(user)) {
      location.replace('/');
    } else if (!user?.face_img && path !== 'addphoto') {
      location.replace('/addphoto');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ME}`)
      handleSuccessNavigation(response)
      setUser(response.data.user)
    } catch(e) {
      console.error('Error fetching user data:', e.message);

      if (e.response && e.response.status === 401) {
        handleErrorNavigation()
      } else {
        alert('Terjadi kesalahan saat memuat data pengguna. mohon refresh page anda');
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const stableHandleClickOutside = useCallback(
    (e) => handleClickOutside(e, popupRef, setShowPopup),
    [popupRef, setShowPopup]
  );
  
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    checkAuth()
  }, [])

  useEffect(() => {
    
    if (showPopup?.show) {
      document.addEventListener('click', stableHandleClickOutside);
    } else {
      document.removeEventListener('click', stableHandleClickOutside);
    }

    return () => {
      document.removeEventListener('click', stableHandleClickOutside);
    };

  }, [showPopup, stableHandleClickOutside])
  return (
    <>
    { loading && <Loading /> }
    <Header setShowPopup={setShowPopup} isLongClicked={isLongClicked} setIsLongClicked={setIsLongClicked} isHomepage={isHomepage} user={user} showNotificationButton={showNotificationButton} />

    {
      !loading && 
        <Routes>
          <Route path="/" element={
            <PrivateLayout>
              <Home setIsHomepage={setIsHomepage} setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
              {
                showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
              }
              </Home>
            </PrivateLayout>
          } />
          <Route path="/statistics" element={
            <PrivateLayout>
              <Statistics setShowNotificationButton={setShowNotificationButton} />
            </PrivateLayout>
          } />
          <Route path="/absen" element={
            <PrivateLayout>
              <Absen setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
              {
                showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
              }
              </Absen>
            </PrivateLayout>
          } />
          <Route path="/notifications" element={
            <PrivateLayout>
              <Notifications isLongClicked={isLongClicked} setIsLongClicked={setIsLongClicked} setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
                {
                  showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                }
              </Notifications>
            </PrivateLayout>
          } />
          <Route path="/notification/:slug" element={
            <PrivateLayout>
              <Notification setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton} />
            </PrivateLayout>
          } />
          <Route path="/addphoto" element={
            <Addphoto checkAuth={checkAuth} setLoading={setLoading} setShowPopup={setShowPopup}>
              {
                showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
              }
            </Addphoto>
          } />

          <Route path="/login" element={
            <Login checkAuth={checkAuth} setLoading={setLoading} />
          } />
          <Route path="/*" element={
            <NotFound />
          }/>
        </Routes>    
    }
    </>
  );
}

export default App;
