/* eslint-disable react/prop-types */
import { Loading, Container, Row, Col, FloatingButton, ModalBox } from "@/components";
import UserService from "@/services/UserService"
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { handleInPopup } from '@/utils/Popup';
import { useEffect, useState } from "react"

const Permits = ({setShowPopup, setShowNotificationButton, children}) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [modalContent, setModalContent] = useState({
    title: '',
    callback: '',
    content: '',
    addButton: ''
  })
  let page = 1
  let isLoad = false;
  let allPermit = false;
  let scrollTo = 0

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const handleSuccess = e => {
    setData(prev => [...prev, ...e.data])
    isLoad = false

    if(e.last_page === page) {
      allPermit = true
    } else {
      page += 1
    }
    setTimeout(() => {
      window.scroll(0, scrollTo)
    }, 700)
  }
  const handleSuccessDelete = e => {
    let p = Math.ceil(data.length / 10)
    handleInPopup({title: 'Sukses!', content: e.message, setShowPopup})
    setData([])
    for(let i = 0; i < p; i++) {
      singleExecute('getPermits', i+1)
    } 
  }

  const { singleExecute } = useMultipleFetch({fetchs: [UserService.getPermits, UserService.deletePermits], setLoading, 
    errorCallbackMap: {
        getPermits: handleError,
        deletePermits: handleError
    },
    successCallbackMap: {
      getPermits: handleSuccess,
      deletePermits: handleSuccessDelete
    }
  });

  const handleScroll = () => {
    if(!isLoad && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight && !allPermit) {
      scrollTo = window.scrollY
      isLoad = true

      setTimeout(() => {
        singleExecute('getPermits', page)
      }, 500)
      
    }
    
  }

  const fetch_data = async () => {
    singleExecute('getPermits')
  }
  useEffect(() => {
    setShowNotificationButton(true)
    import('@/css/user/permits/index.css')
    fetch_data()

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if(loading) {
    return (
      <Loading />
    )
  }
  return (
    <>
      {children}
      <Container size={'-fluid'} marginTop={3} marginBottom={5}>
        <Row addClass={'align-items-center justify-content-center'}>
          <Col size={'-md-8'}>
            {
              data.length > 0 ? 
                data.map((permit, i) => (
                  <div className="card mb-3" key={i} data-bs-toggle="modal" data-bs-target="#modalBox" onClick={() => setModalContent({
                    title: 'Detail izin',
                    callback: () => {},
                    addButton: permit.status === 'pending' ? <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => singleExecute('deletePermits', permit.id)}>Cancel izin</button> : '',
                    content: [...Object.keys(permit)].map((value, i) => value !== 'id' && 
                    (<div key={i} className="d-flex flex-column gap-1 mb-2">
                      <span className="fw-medium fs-5 text-capitalize">{value.split('_').join(' ')} :</span>
                      <span className="text-capitalize">{permit?.[value] && typeof(permit?.[value]) !== 'object' ? permit?.[value] : '-'}{value.toLowerCase() === 'radius' ? 'm' : ''}</span>
                    </div>))
                  })}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-column">
                          <h2 className="text-capitalize m-0">{permit.jenis_izin}</h2>
                          <span>{permit.tanggal}</span>
                        </div>
                        <p className="text-capitalize">{permit.status}</p>
                      </div>
                      <p className="mt-3 mb-0">{permit.alasan}</p>
                    </div>
                  </div>
                ))
              :
                <h1 className="text-center">Anda belum pernah izin</h1>
            }
          </Col>
        </Row>
        <FloatingButton callback={() => location.replace('/permits/create')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-file-earmark-check" viewBox="0 0 16 16">
            <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
          </svg>
        </FloatingButton>
        <ModalBox title={modalContent.title} callback={modalContent.callback} addButton={modalContent.addButton}>
          {modalContent.content }
        </ModalBox>
      </Container>
    </>
  )
}

export default Permits