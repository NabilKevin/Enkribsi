/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeft, XButton, Logo, NotificationBell, HomeUserCard } from './components';
import { useEffect, useContext } from "react"
import UserService from "@/services/UserService"
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { handleInPopup } from '@/utils/Popup';
import HeaderContext from '@/context/HeaderContext';

/* eslint-disable react/prop-types */
const Header = () => {
  const {isHomepage, user, showNotificationButton, isLongClicked, setIsLongClicked, setShowPopup, onlyLogo} = useContext(HeaderContext);
  const handleErrorNotificationsCount = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const { data: notificationsCount, execute: setNotificationsCount } = useMultipleFetch({fetchs: [UserService.getNotificationsCount], 
    errorCallbackMap: {
        getNotificationsCount: handleErrorNotificationsCount,
    }
  });

  const fetch_data = async () => {
    setNotificationsCount();
  }

  const path = location.pathname.split('/')[1].toLowerCase()
  const onlyLogoPath = ['addphoto', 'hr', 'admin', 'bod', onlyLogo && path]

  useEffect(() => {
    if(showNotificationButton) {
      fetch_data()
    }
  }, [showNotificationButton])
  
  return (
    <div className="header position-fixed top-0 start-0 end-0 z-1">
        <div className="d-flex align-items-center justify-content-between">
        {!showNotificationButton && !onlyLogoPath.includes(path) ? <div>
            {
              !showNotificationButton ?
              <> {!isLongClicked ? <ChevronLeft path={path} /> : <XButton setIsLongClicked={setIsLongClicked} /> } </> : <></>
            }
          </div> : <></>}

          <Logo path={path} />

          { !onlyLogoPath.includes(path) ? <div>
            {
              showNotificationButton ? <NotificationBell notificationsCount={notificationsCount} /> : <></>
            }
          </div> : <></> }
        </div>
        {
          isHomepage && <HomeUserCard user={user} />
        }
      </div>
  )
}

export default Header