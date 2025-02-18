/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getNotification } from "@/utils/Api"
import { handleInPopup } from "@/utils/Popup"
import { Loading, Card, Container } from "@/components"

const Notification = ({setShowPopup}) => {
  const [notification, setNotification] = useState()
  const [loading, setLoading] = useState(true)

  const {slug} = useParams()
  
  const fetch_data = async () => {
    try {
      setNotification(await getNotification({setShowPopup, slug}))
    } catch(e) {
      handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch_data()
    import('@/css/notification/index.css')
  }, [])

  if(loading) {
    return <Loading />
  }
  return (
    <>
      <Container size={'-lg'}>
        <Card addClass={'shadow p-4'} >
          <h1 className="text-center mb-5">{notification?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: notification?.content}}></div>
        </Card>
      </Container>
    </>
  )
}

export default Notification