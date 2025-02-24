/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getNotification } from "@/utils/Api"
import { handleInPopup } from "@/utils/Popup"
import { Loading, Card, Container } from "@/components"
import { useMultipleFetch } from '@/hooks/useMultipleFetch';

const Notification = ({setShowPopup}) => {
  const [loading, setLoading] = useState(true)

  const {slug} = useParams()

  const handleErrorNotification = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const { data: notification, execute: setNotification } = useMultipleFetch({fetchs: [getNotification], setLoading, 
    errorCallbackMap: {
        getNotification: handleErrorNotification,
    }
  });
  
  const fetch_data = async () => {
    setNotification(slug)
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
      <Container size={'-lg'} marginTop={4}>
        <Card addClass={'shadow p-4'} >
          <h1 className="text-center mb-5">{notification?.getNotification?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: notification?.getNotification?.content}}></div>
        </Card>
      </Container>
    </>
  )
}

export default Notification