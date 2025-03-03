/* eslint-disable react-hooks/exhaustive-deps */
import { Addphoto, Home, Statistics, Absen, Notifications, Notification, PrivateLayout } from "@/pages/Private/User";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleOutPopup, handleClickOutside } from '@/utils/Popup';
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login, NotFound, Forbidden } from "@/pages/Public";
import { DashboardHr, StatisticsHr } from "@/pages/Private/Dashboard/Hr";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { DashboardLayout } from "@/pages/Private/Dashboard/";
import { Loading, Popup } from "@/components";
import UserService from "@/services/UserService";
import HeaderContext from "@/context/HeaderContext";

import axios from "axios";
import "./css/header/index.css";
import "./css/main.css";

const App = () =>  {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate()

  const [showNotificationButton, setShowNotificationButton] = useState()
  const [isLongClicked, setIsLongClicked] = useState(false)
  const [isForbidden, setIsForbidden] = useState(false)
  const [isHomepage, setIsHomepage] = useState(false)
  const [showPopup, setShowPopup] = useState({show: false, slide: 'in', title: '', content: ''})
  const [onlyLogo, setOnlyLogo] = useState(false)
  const [loading, setLoading] = useState(true)

  const popupRef = useRef(null)

  const path = location.pathname.split('/')[1]

  const canUseDashboard = () => {
    if(path === 'hr' || path === 'bod' || path === 'admin') {
      if(user.getAuth?.role === 'user') {
        setIsForbidden(true)
        navigate('/forbidden')
      } else {
        if(path !== user.getAuth?.role) {
          setIsForbidden(true)
          navigate('/forbidden')
        } else {
          document.body.style.paddingTop = '0px'
          document.body.style.paddingBottom = '0px'
        }
      }
    }
  }

  const shouldNavigateToHome = (user) => {
    return path === 'login' || (user?.face_img && path === 'addphoto');
  }
  
  const handleErrorNavigation = () => {
    if(path !== 'login') {
      location.replace('/login');
    }
  }

  const handleSuccessNavigation = (user) => {
    if (shouldNavigateToHome(user)) {
      location.replace('/');
    } else if (!user?.face_img && path !== 'addphoto') {
      location.replace('/addphoto');
    }
  }

  const handleErrorAuth = (e) => {
    if (e.response && e.response.status === 401) {
      handleErrorNavigation()
    } else {
      alert('Terjadi kesalahan saat memuat data pengguna. mohon refresh page anda');
    }
  }

  const { data: user, execute: checkAuth } = useMultipleFetch({fetchs: [UserService.getAuth], setLoading, 
    errorCallbackMap: {
        getAuth: handleErrorAuth,
    },
    successCallbackMap: {
        getAuth: handleSuccessNavigation,
    }
  });

  const stableHandleClickOutside = useCallback(
    (e) => handleClickOutside(e, popupRef, setShowPopup),
    [popupRef, setShowPopup]
  )
  
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    checkAuth()
  }, [])

  useEffect(() => {
    if(user.getAuth) {
      canUseDashboard()
    }
  }, [user.getAuth])

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

  if(loading) {
    return <Loading />
  }
  
  return (
    <>

      <HeaderContext.Provider value={{setShowPopup, isLongClicked, setIsLongClicked, isHomepage, user: user.getAuth, showNotificationButton, onlyLogo}}>
        
        <Routes>

          {/* -------------- Start User -------------- */}

            <Route path="/" element={
              <PrivateLayout>
                <Home setIsHomepage={setIsHomepage} setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
                {
                  showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                }
                </Home>
              </PrivateLayout>
            } />
            <Route path="/statistik" element={
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

          {/* -------------- End User -------------- */}



          {/* -------------- Start Hr -------------- */}

          <Route path="hr" element={ <DashboardLayout /> } >
            <Route path="" element={ <DashboardHr setShowPopup={setShowPopup} /> } />
            <Route path="statistik" element={ <StatisticsHr /> } />
          </Route>

          {/* -------------- End Hr -------------- */}



          {/* -------------- Start Public -------------- */}

          <Route path="/login" element={
            <Login checkAuth={checkAuth} setLoading={setLoading} />
          } />

          {
            isForbidden && 
            <Route path="/forbidden" element={
              <Forbidden setOnlyLogo={setOnlyLogo}/>
            }/>
          }

          <Route path="/*" element={
            <NotFound setOnlyLogo={setOnlyLogo}/>
          }/>


          {/* -------------- End Public -------------- */}

        </Routes>  

      </HeaderContext.Provider>

    </>
  );
}

export default App;
