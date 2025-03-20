/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { handleInPopup } from "@/utils/Popup"
import { Loading, Card, Container, ModalBoxButton, ModalBox } from "@/components"
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import BodService from "@/services/BodService"

const Single = ({setShowPopup, children, setIsNotfound}) => {
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState({
    title: '',
    callback: () => {},
    content: ''
  })

  const {id} = useParams()

  const handleError = e => {
    if(e.status === 404) {
      setIsNotfound(true)
    }
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const handleSuccess = () => {
    location.replace('/bod/announcements')
  }

  const { data, singleExecute } = useMultipleFetch({fetchs: [BodService.getAnnouncement, BodService.denyAnnouncements, BodService.approveAnnouncements], setLoading, 
    errorCallbackMap: {
      getAnnouncement: handleError,
      approveAnnouncements: handleError,
      denyAnnouncements: handleError
    },
    successCallbackMap: {
      approveAnnouncements: handleSuccess,
      denyAnnouncements: handleSuccess
    }
  });
  
  const fetch_data = async () => {
    singleExecute('getAnnouncement', id)
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
          data.getAnnouncement &&
        <Card addClass={'shadow p-4'} >
          <h1 className="text-center mb-4">{data?.getAnnouncement?.judul}</h1>
          <div className="mb-4 d-flex w-100 justify-content-around my-4">
            <span className="desc-span fs-5 text-capitalize">Target audiens: <strong>{!data?.getAnnouncement?.target_audiens ? 'Semua' : data.getAnnouncement.target_audiens.username}</strong></span>
            <span className="desc-span fs-5 text-capitalize">Status: {formatStatus(data?.getAnnouncement?.status)}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: data?.getAnnouncement?.isi_pengumuman}}></div>
          <div className="mt-5 d-flex gap-5 justify-content-center align-items-center">
            <ModalBoxButton className="btn btn-success ms-1 btn-action-announcement mt-1" callback={() => setModalContent({
              title: 'Konfirmasi setuju!',
              content: <span>Yakin ingin setujui pengumuman ini? ({data.getAnnouncement?.judul})</span>,
              callback: () =>  singleExecute('approveAnnouncements', id)
            })}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
              </svg>
            </ModalBoxButton>
            <ModalBoxButton className="btn btn-danger ms-1 mt-1 btn-action-announcement" callback={() => setModalContent({
              title: 'Konfirmasi tolak!',
              content: <span>Yakin ingin tolak pengumuman ini? ({data?.getAnnouncement?.judul})</span>,
              callback: () =>  singleExecute('denyAnnouncements', id)
            })}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
              </svg>
            </ModalBoxButton>
          </div>
        </Card>
        }
      </Container>
      <ModalBox title={modalContent.title} callback={modalContent.callback}>
        {modalContent.content }
      </ModalBox>
    </>
  )
}

export default Single