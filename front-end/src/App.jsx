/* eslint-disable react-hooks/exhaustive-deps */
import { Addphoto, Home, Statistics, Absen, Notifications, Notification, PrivateLayout } from "@/pages/Private/User";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleOutPopup, handleClickOutside } from '@/utils/Popup';
import { Route, Routes } from "react-router-dom";
import { Login, NotFound } from "@/pages/Public";
import { 
    DashboardHr, StatisticsHr, StatisticHr, 
    AnnouncementsHr, CreateAnnouncementsHr, SingleAnnouncementsHr, EditAnnouncementsHr,
    OfficesHr, CreateOfficesHr, EditOfficesHr,
    SchedulesHr, CreateSchedulesHr, EditSchedulesHr,
    WfhSchedulesHr, CreateWfhSchedulesHr, EditWfhSchedulesHr,
    ProfileHr
 } from "@/pages/Private/Dashboard/Hr";
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

  const [showNotificationButton, setShowNotificationButton] = useState()
  const [isLongClicked, setIsLongClicked] = useState(false)
  const [isForbidden, setIsForbidden] = useState(false)
  const [isNotfound, setIsNotfound] = useState(false)
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
      } else {
        if(path !== user.getAuth?.role) {
          setIsForbidden(true)
        } else {
          if(!isNotfound) {
            document.body.style.paddingTop = '0px'
            document.body.style.paddingBottom = '0px'
          } else {
            document.body.style.paddingTop = '70px'
            document.body.style.paddingBottom = '74px'
          }
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
    if(user.getAuth || isNotfound) {
      canUseDashboard()
    }
  }, [user.getAuth, isNotfound])

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
              <Addphoto checkAuth={checkAuth} setShowPopup={setShowPopup}>
                {
                  showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                }
              </Addphoto>
            } />

          {/* -------------- End User -------------- */}


          {
            !isForbidden &&
            <>

            {/* -------------- Start Hr -------------- */}

            <Route path="hr" element={ <DashboardLayout /> } >
              <Route path="" element={ 
                <DashboardHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </DashboardHr>
              } />
              <Route path="statistics" element={ 
                <StatisticsHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </StatisticsHr>
              } />
              <Route path="statistic" element={
                <StatisticHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </StatisticHr>
              }/>
              <Route path="statistic/:username" element={
                <StatisticHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </StatisticHr>
              }/>                                                                                     
              <Route path="announcements" element={
                <AnnouncementsHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </AnnouncementsHr>
              }/>
              <Route path="announcements/create" element={
                <CreateAnnouncementsHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </CreateAnnouncementsHr>
              }/>
              <Route path="announcements/:slug" element={
                <SingleAnnouncementsHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </SingleAnnouncementsHr>
              }/>
              <Route path="announcements/:slug/edit" element={
                <EditAnnouncementsHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </EditAnnouncementsHr>
              }/>
              <Route path="offices" element={
                <OfficesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </OfficesHr>
              }/>
              <Route path="offices/create" element={
                <CreateOfficesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </CreateOfficesHr>
              }/>
              <Route path="offices/:id/edit" element={
                <EditOfficesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </EditOfficesHr>
              }/>
              <Route path="schedules" element={
                <SchedulesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </SchedulesHr>
              }/>
              <Route path="schedules/create" element={
                <CreateSchedulesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </CreateSchedulesHr>
              }/>
              <Route path="schedules/:id/edit" element={
                <EditSchedulesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </EditSchedulesHr>
              }/>
              <Route path="wfh/schedules" element={
                <WfhSchedulesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </WfhSchedulesHr>
              }/>
              <Route path="wfh/schedules/create" element={
                <CreateWfhSchedulesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </CreateWfhSchedulesHr>
              }/>
              <Route path="wfh/schedules/:id/edit" element={
                <EditWfhSchedulesHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </EditWfhSchedulesHr>
              }/>
              <Route path="profile" element={
                <ProfileHr setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </ProfileHr>
              }/>
            </Route>

            {/* -------------- End Hr -------------- */}

            </>
          }



          {/* -------------- Start Public -------------- */}

          <Route path="/login" element={
            <Login checkAuth={checkAuth} setLoading={setLoading} />
          } />

          <Route path="/*" element={
            <NotFound setOnlyLogo={setOnlyLogo} setIsNotfound={setIsNotfound}/>
          }/>


          {/* -------------- End Public -------------- */}

        </Routes>  

      </HeaderContext.Provider>

    </>
  );
}

export default App;
