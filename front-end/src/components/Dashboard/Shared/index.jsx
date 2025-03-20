/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Card } from "@/components"

const HrBodLink = ({page}) => {
  const path = location.pathname.split('/')[2]?.toLowerCase()
  return (
    <>
      <a href={`/${page}`} className={`px-3 pb-2 pt-3 ${!path ? 'fw-bold' : ''}`} >Dashboard</a>
      <a href={`/${page}/statistics`} className={`px-3 pb-2 pt-3 ${path?.includes('statistic') ? 'fw-bold' : ''}`}>Statistik</a>
      <a href={`/${page}/announcements`} className={`px-3 pb-2 pt-3 ${path?.includes('announcement') ? 'fw-bold' : ''}`}>Pengumuman</a>
      <a href={`/${page}/offices`} className={`px-3 pb-2 pt-3 ${path?.includes('office') ? 'fw-bold' : ''}`}>Kantor</a>
      <a href={`/${page}/schedules`} className={`px-3 pb-2 pt-3 ${path?.includes('schedule') ? 'fw-bold' : ''}`}>Jadwal Kantor</a>
      <a href={`/${page}/wfh/schedules`} className={`px-3 pb-2 pt-3 ${path?.includes('wfh') ? 'fw-bold' : ''}`}>Jadwal Wfh</a>
      <a href={`/${page}/profile`} className={`px-3 pb-2 pt-3 ${path?.includes('profile') ? 'fw-bold' : ''}`}>Profile</a>
    </>
  )
}
const AdminLink = ({page}) => {
  const path = location.pathname.split('/')[2]?.toLowerCase()
  return (
    <>
      <a href={`/${page}`} className={`px-3 pb-2 pt-3 ${!path ? 'fw-bold' : ''}`} >Dashboard</a>
      <a href={`/${page}/profile`} className={`px-3 pb-2 pt-3 ${path?.includes('profile') ? 'fw-bold' : ''}`}>Profile</a>
    </>
  )
}

const Links = ({display, addClass}) => {
  const path = location.pathname.split('/')[1].toLowerCase()
  
  return (
    <div className={`links gap-1 bg-dark ${addClass ? addClass : ''}`} style={{ display: display }}>
      {path !== 'admin' ? <HrBodLink page={path} /> : <AdminLink page={path} />} 
    </div>
  )
}

export const Sidebar = () => {
  const [show, setShow] = useState(false)
  const [addClassLinks, setAddClassLinks] = useState('')
  useEffect(() => {
    import('@/css/dashboard/sidebar/index.css')
  })

  const showSidebar = () => {
    setShow(prev => !prev)
  }

  const openSidebar = () => {
    setAddClassLinks('slideDown')
    showSidebar()
  }
  const closeSidebar = () => {
    setAddClassLinks('slideUp')
    setTimeout(() => {
      showSidebar()
    }, 500)
  }
  return (
    <>
    <div className="sidebar bg-dark text-light d-flex gap-1 shadow border-bottom border-opacity-10 border-1 border-secondary">
      <h2 className="logo">Enkribsi</h2>
      {!show ? <Links /> : <></>}
      <div className="list">
        {
          show ? 
          <svg onClick={closeSidebar} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
            :
          <svg onClick={openSidebar} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg> 
        }
      </div>
    </div>
    {show ? <Links display={'flex'} addClass={addClassLinks} /> : <></>}
    </>
  )
} 

export const DateComp = () => {
  const date = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const [today, setToday] = useState(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`)
  const [time, setTime] = useState(`${date.getHours()}:${String(date.getMinutes()).padStart(2, 0)}:${String(date.getSeconds()).padStart(2, 0)}`)

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date()
      setToday(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`)
      setTime(`${date.getHours()}:${String(date.getMinutes()).padStart(2, 0)}:${String(date.getSeconds()).padStart(2, 0)}`)
    }, 1000);
  
    return () => clearInterval(timer);

  }, []);
  return (
    <Card addClass="mb-3" addClassBody="p-4 d-flex justify-content-center flex-column gap-1">
      <div className="d-flex justify-content-between mb-4">
          <div className="d-flex align-items-center justify-content-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
            </svg>
            <span className="fs-5">
              {time} WIB
            </span>
          </div>
      </div>
      <h4>Hari Ini:</h4>
      <h5>{today}</h5>
    </Card>
  )
}

export const Table = ({children}) => {
  return (
    <table className="table table-hover text-center">
      {children}
    </table>
  )
}