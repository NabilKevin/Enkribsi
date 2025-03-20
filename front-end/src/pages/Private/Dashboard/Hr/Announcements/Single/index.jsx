/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { handleInPopup } from "@/utils/Popup"
import { Loading, Card, Container } from "@/components"
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from "@/services/HrService"

const Single = ({setShowPopup, children, setIsNotfound}) => {
  const [loading, setLoading] = useState(true)

  const {slug} = useParams()

  const handleError = e => {
    if(e.status === 404) {
      setIsNotfound(true)
    }
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const { data: announcement, execute: setAnnouncement } = useMultipleFetch({fetchs: [HrService.getAnnouncement], setLoading, 
    errorCallbackMap: {
      getAnnouncement: handleError,
    }
  });
  
  const fetch_data = async () => {
    setAnnouncement(slug)
  }

  const formatStatus = status => {
    let data;
    switch(status.toLowerCase()) {
      case 'approved':
        data = <span className="text-success">{status}</span>
        break;
      case 'denied':
        data = <span className="text-danger">{status}</span>
        break;
      case 'canceled':
        data = <span className="text-dark">{status}</span>
        break;
      default : 
        data = <span className="text-secondary">{status}</span>
        break;
    }
    return data
  }

  useEffect(() => {
    fetch_data()
    import('@/css/dashboard/hr/announcement/single/index.css')
  }, [])

  if(loading) {
    return <Loading />
  }
  return (
    <>
      <Container size={'-lg'} marginTop={4}>
        {children}
        {
          announcement?.getAnnouncement &&
          <Card addClass={'shadow p-4'} >
            <h1 className="text-center mb-4">{announcement?.getAnnouncement?.judul}</h1>
            <div className="mb-4 d-flex w-100 justify-content-around my-4">
              <span className="desc-span fs-5 text-capitalize">Target audiens: <strong>{!announcement?.getAnnouncement?.target_audiens ? 'Semua' : announcement.getAnnouncement.target_audiens.username}</strong></span>
              <span className="desc-span fs-5 text-capitalize">Status: {formatStatus(announcement?.getAnnouncement?.status)}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: announcement?.getAnnouncement?.isi_pengumuman}}></div>
          </Card>
        }
      </Container>
    </>
  )
}

export default Single