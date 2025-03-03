/* eslint-disable react/prop-types */
export const ChevronLeft = ({path}) => {
  return (
    <a href={`/${path === 'notification' ? 'notifications' : ''}`} className="text-decoration-none d-flex">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-chevron-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
      </svg>
    </a>  
  )
}

export const XButton = ({setIsLongClicked}) => {
  return (
    <button className="btn-transparent" onClick={() => setIsLongClicked(false)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="white" className="bi bi-x pointer" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
      </svg>
    </button>
  )
}

export const Logo = ({path}) => {
  const href = ['hr', 'admin', 'bod'];
  return (
    <a href={`/${href.includes(path) ? path : ''}`} className="text-decoration-none text-white"><h2 className="m-0">Enkribsi</h2></a>
  )
}

export const NotificationBell = ({notificationsCount}) => {
  return (
    <a href="/notifications" className="text-decoration-none d-flex position-relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-bell-fill" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
      </svg>
      {
        notificationsCount?.getNotificationsCount > 0 && <span className="position-absolute top-0 notificationAlert translate-middle badge border border-light rounded-circle bg-danger"><span>{notificationsCount?.getNotificationsCount}</span></span> 
      }
    </a>
  )
}

export const HomeUserCard = ({user}) => {
  return (
    <div className="w-100 d-flex align-items-center justify-content-center">
      <div className="mt-4 d-flex bg-light gap-3 align-items-center text-dark p-3 rounded fs-5 fw-medium w-100" style={{ maxWidth: '1000px' }}>
            <span>Halo, {user?.username}!</span>
      </div>
    </div>
  )
}