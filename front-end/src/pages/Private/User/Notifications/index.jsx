/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { CardNotifications } from "@/components"
import { getNotifications, deleteNotification } from "@/utils/api"
import { handleInPopup } from '@/utils/Popup';
import { FloatingButton, Loading, Container, Row, Col } from "@/components";

const Notifications = ({setShowPopup, setShowNotificationButton, isLongClicked, setIsLongClicked, children}) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch_data = async () => {
    try {
      setNotifications(await getNotifications({setShowPopup}))
    } catch(e) {
      handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSelected = async e => {
    e.preventDefault();
    const slugs = [...e.target].map(el => {
      if(el.type.toLowerCase() === "checkbox" && el.checked) {
        return parseInt(el.id)
      }
    }).filter(el => el)
    
    if(slugs.length === 0) {
      handleInPopup({title: 'Peringatan!', content: 'Kamu harus menyeleksi minimal 1 notifikasi untuk dihapus!', setShowPopup})
    } else {
      await deleteNotification({slugs, setShowPopup, callback: () => {
        fetch_data()
        setLoading(true)
        setIsLongClicked(false)
      }})
    }
    
  }

  useEffect(() => {
    setShowNotificationButton(false)
    import('@/css/notifications/index.css')
    fetch_data()
  }, [])

  if(loading) {
    return (
      <Loading />
    )
  }
  return (
    <>
      {children}
      <Container>
        <Row>
          <Col size={'-md-8'}>
            <form onSubmit={handleDeleteSelected}>
            {
              notifications.map((notification, i) => (<CardNotifications slug={notification?.slug} key={i} isLongClicked={isLongClicked} setIsLongClicked={setIsLongClicked} title={notification?.title} excerpt={notification?.excerpt + '...'} />))
            }
            { isLongClicked && 
              <FloatingButton type={'submit'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              </FloatingButton>
            }
            </form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Notifications