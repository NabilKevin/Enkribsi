// import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login, NotFound } from "./pages/Public";
import { Addphoto, Home, PrivateLayout, Statistics, Absen } from "./pages/Private";
import { Header, Loading, Popup } from "./components";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./css/header/index.css";
import "./css/main.css";
import { API_ENDPOINTS, BASE_URL_API } from "./config";
import { handleOutPopup, handleClickOutside } from '@/utils/Popup';

function App() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [isHomepage, setIsHomepage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  const [showNotificationButton, setShowNotificationButton] = useState()
  const [showPopup, setShowPopup] = useState({show: false, slide: 'in', title: '', content: ''})
  const path = location.pathname.split('/')[1]
  const popupRef = useRef(null)

  const shouldNavigateToHome = (user) => {
    return path === 'login' || (user?.face_img && path === 'addphoto');
  };
  
  const handleSuccessNavigation = (response) => {
    const user = response.data.user;
  
    if (shouldNavigateToHome(user)) {
      navigate('/');
      setIsHomepage(true);
    } else if (!user?.face_img) {
      navigate('/addphoto');
      setIsHomepage(false);
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
        if(path !== 'login') {
          navigate('/login');
          setIsHomepage(false);
        }
      } else {
        alert('Terjadi kesalahan saat memuat data pengguna.');
      }
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if(path === '') {
      setIsHomepage(true)
    }
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    checkAuth()
  }, [])

  const stableHandleClickOutside = useCallback(
    (e) => handleClickOutside(e, popupRef, setShowPopup),
    [popupRef, setShowPopup]
  );

  useEffect(() => {
    console.log(showPopup?.show);
    
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
    <Header isHomepage={isHomepage} user={user} showNotificationButton={showNotificationButton} />

    {
      !loading && 
        <Routes>
          <Route path="/" element={
            <PrivateLayout>
              <Home setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
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
              <Absen setIsHomepage={setIsHomepage} setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
              {
                showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
              }
              </Absen>
            </PrivateLayout>
          } />
          <Route path="/addphoto" element={
            <Addphoto checkAuth={checkAuth} setLoading={setLoading} setShowPopup={setShowPopup}  setShowPopup={setShowPopup}>
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
