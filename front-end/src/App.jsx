/* eslint-disable react-hooks/exhaustive-deps */
import { Addphoto, Home, Statistics, Absen, Notifications, Notification, PrivateLayout, Profile, Permits, CreatePermits } from "@/pages/Private/User";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleOutPopup, handleClickOutside } from '@/utils/Popup';
import { Route, Routes } from "react-router-dom";
import { Login, NotFound, Forgotpassword } from "@/pages/Public";
import { 
    DashboardHr, StatisticsHr, StatisticHr, 
    AnnouncementsHr, CreateAnnouncementsHr, SingleAnnouncementsHr, EditAnnouncementsHr,
    OfficesHr, CreateOfficesHr, EditOfficesHr,
    SchedulesHr, CreateSchedulesHr, EditSchedulesHr,
    WfhSchedulesHr, CreateWfhSchedulesHr, EditWfhSchedulesHr,
    ProfileHr
 } from "@/pages/Private/Dashboard/Hr";
import {
  DashboardBod, DenyFormBod,
  AnnouncementBod, SingleAnnouncementBod,
  OfficeBod, ScheduleBod, WfhScheduleBod, ProfileBod, 
  StatisticBod, StatisticsBod
} from '@/pages/Private/Dashboard/Bod'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { DashboardLayout } from "@/pages/Private/Dashboard/";
import { Loading, Popup } from "@/components";
import UserService from "@/services/UserService";
import HeaderContext from "@/context/HeaderContext";
import { DashboardAdmin, CreateAdmin, ProfileAdmin, EditAdmin } from '@/pages/Private/Dashboard/Admin'

import axios from "axios";
import "./css/header/index.css";
import "./css/main.css";


function App() {
  axios.defaults.withCredentials = true;

  const [showNotificationButton, setShowNotificationButton] = useState()
  const [isLongClicked, setIsLongClicked] = useState(false)
  const [isForbidden, setIsForbidden] = useState(false)
  const [dashboardNotfound, setDashboardNotfound] = useState(false)
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
          if(!dashboardNotfound) {
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
    if(path !== 'login' && path !== 'forgotpassword') {
      location.replace('/login');
    }
  }

  const handleSuccessNavigation = (user) => {
    if(user.role === 'admin') {
      if(path !== 'admin') {
        location.replace('/admin')
      }
    } else {
      if (shouldNavigateToHome(user)) {
        location.replace('/');
      } else if (!user?.face_img && path !== 'addphoto') {
        location.replace('/addphoto');
      }
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
    if(user.getAuth || dashboardNotfound) {
      canUseDashboard()
    }
  }, [user.getAuth, dashboardNotfound])

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
          {
            !isNotfound && 
            <>
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
            <Route path="/profile" element={
              <PrivateLayout>
                <Profile setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </Profile>
              </PrivateLayout>
            } />
            <Route path="/permits" element={
              <PrivateLayout>
                <Permits setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </Permits>
              </PrivateLayout>
            } />
            <Route path="/permits/create" element={
              <PrivateLayout>
                <CreatePermits setShowPopup={setShowPopup} setShowNotificationButton={setShowNotificationButton}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </CreatePermits>
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

            {/* --------------- Start Hr -------------- */}

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
                <StatisticHr setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
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
                <SingleAnnouncementsHr setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </SingleAnnouncementsHr>
              }/>
              <Route path="announcements/:slug/edit" element={
                <EditAnnouncementsHr setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
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
                <EditOfficesHr setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
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
                <EditSchedulesHr setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
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
                <EditWfhSchedulesHr setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
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

            {/* --------------- End Hr ---------------- */}


            {/* -------------- Start Bod -------------- */}

            <Route path="bod" element={ <DashboardLayout /> } >
            <Route path="" element={ 
                <DashboardBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </DashboardBod>
              } />
            <Route path="announcements" element={ 
                <AnnouncementBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </AnnouncementBod>
              } />
            <Route path="permits/:id/deny" element={ 
                <DenyFormBod setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </DenyFormBod>
              } />
            <Route path="announcements/:id" element={ 
                <SingleAnnouncementBod setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </SingleAnnouncementBod>
              } />
              <Route path="offices" element={ 
                <OfficeBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </OfficeBod>
              } />
              <Route path="schedules" element={ 
                <ScheduleBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </ScheduleBod>
              } />
              <Route path="wfh/schedules" element={ 
                <WfhScheduleBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </WfhScheduleBod>
              } />
              <Route path="profile" element={
                <ProfileBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </ProfileBod>
              }/>
              
              <Route path="statistics" element={ 
                <StatisticsBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </StatisticsBod>
              } />
              <Route path="statistic" element={
                <StatisticBod setShowPopup={setShowPopup}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </StatisticBod>
              }/>
              <Route path="statistic/:username" element={
                <StatisticBod setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
                  {
                    showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                  }
                </StatisticBod>
              }/>    
            </Route>

            {/* --------------- End Bod --------------- */}

            {/* ------------- Start Admin ------------- */}

              <Route path="admin" element={ <DashboardLayout />}>
                <Route path="" element={ 
                  <DashboardAdmin setShowPopup={setShowPopup}>
                    {
                      showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                    }
                  </DashboardAdmin>
                } />
                <Route path="create" element={ 
                  <CreateAdmin setShowPopup={setShowPopup}>
                    {
                      showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                    }
                  </CreateAdmin>
                } />
                <Route path="profile" element={ 
                  <ProfileAdmin setShowPopup={setShowPopup}>
                    {
                      showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                    }
                  </ProfileAdmin>
                } />
                <Route path="edit/:id" element={ 
                  <EditAdmin setShowPopup={setShowPopup} setIsNotfound={setIsNotfound}>
                    {
                      showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
                    }
                  </EditAdmin>
                } />
              </Route>

            {/* -------------- End Admin -------------- */}

            </>
          }
          </>
          }



          {/* -------------- Start Public -------------- */}

          <Route path="/login" element={
            <Login checkAuth={checkAuth} />
          } />
          <Route path="/forgotpassword" element={
            <Forgotpassword setShowPopup={setShowPopup}>
              {
                showPopup?.show && <Popup title={showPopup?.title} content={showPopup?.content} popupRef={popupRef} slide={showPopup?.slide} handleOutPopup={handleOutPopup} setShowPopup={setShowPopup} />
              }
            </Forgotpassword>
          } />

          <Route path="/*" element={
            <NotFound setOnlyLogo={setOnlyLogo} setDashboardNotfound={setDashboardNotfound}/>
          }/>


          {/* -------------- End Public -------------- */}

        </Routes>  

      </HeaderContext.Provider>

    </>
  );
}

export default App;
