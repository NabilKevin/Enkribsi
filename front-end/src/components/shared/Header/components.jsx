import { useEffect, useState } from "react"

/* eslint-disable react/prop-types */
export const ChevronLeft = ({path}) => {
  return (
    <a href={`/${path === 'notification' ? 'notifications' : ''}${path === 'permits' ? 'permits' : ''}`} className="text-decoration-none d-flex">
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
  const date = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu']
  const [today, setToday] = useState(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`)
  const [time, setTime] = useState(`${date.getHours()}:${String(date.getMinutes()).padStart(2, 0)}:${String(date.getSeconds()).padStart(2, 0)}`)
  const [day, setDay] = useState(days[date.getDay()])

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date()
      setDay(days[date.getDay()])
      setToday(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`)
      setTime(`${date.getHours()}:${String(date.getMinutes()).padStart(2, 0)}:${String(date.getSeconds()).padStart(2, 0)}`)
    }, 1000);
  
    return () => clearInterval(timer);

  }, []);
  return (
    <div className="w-100 d-flex align-items-center justify-content-center">
      <div className="mt-4 d-flex bg-light gap-3 justify-content-center text-dark p-3 rounded flex-column fs-5 fw-medium w-100 shadow" style={{ maxWidth: '1000px' }}>
        <span>Halo, {user?.username}!</span>
        <div className="timeHeader d-flex w-100 align-items-center justify-content-between">
          <div className="jam d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-clock-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
            </svg>
            <div className="jamText d-flex flex-column justify-content-center">
              <span>Jam</span>
              <span>{time}</span>
            </div>
          </div>
          <div className="d-flex align-items-center flex-column justify-content-center">
            <span>{day}</span>
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  )
}