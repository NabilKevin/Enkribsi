/* eslint-disable react/prop-types */
import { Container, Loading, ModalBoxButton, ModalBox, PaginateButton } from '@/components'
import { Table } from "@/components/Dashboard/Shared";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import BodService from '@/services/BodService'
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';

const Announcement = ({children, setShowPopup}) => {
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState({
    title: '',
    callback: () => {},
    content: ''
  })

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
  const handleSuccess = e => {
    singleExecute('getAnnouncements')
    handleInPopup({title: 'Sukses!', content: e?.message, setShowPopup})
  }

const {data, singleExecute} = useMultipleFetch({fetchs: [BodService.getAnnouncements, BodService.denyAnnouncements, BodService.approveAnnouncements], setLoading,
    errorCallbackMap: {
      getAnnouncements: handleError,
      denyAnnouncements: handleError,
      approveAnnouncements: handleError
    },
    successCallbackMap: {
      denyAnnouncements: handleSuccess,
      approveAnnouncements: handleSuccess
    }
  })

  const handleChangePage = (page = 1) => {
    singleExecute('getAnnouncements', page)
  }

  useEffect(() => {
    import('@/css/dashboard/hr/announcement/index.css')
    singleExecute('getAnnouncements')
  }, [])
    
  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-5'>Pengumuman</h1>
      <div className="d-flex mb-3 align-items-center header-text-announcement">
        <h2>List pengumuman</h2>
      </div>
      <hr />
      {
        data?.getAnnouncements?.data?.length > 0 ? 
          <>
          <Table>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col' className='text-capitalize'>Judul</th>
                <th scope='col'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {
                data.getAnnouncements.data.map((d, i) => (
                  <tr key={i}>
                    <td>{i+1}</td>
                    <td className='scroll'>{d['judul'].length > 27 ? d['judul'].slice(0,27) + '...' : d['judul']}</td>
                    <td>
                      <a className="btn btn-dark ms-1 btn-action-announcement mt-1" href={`/bod/announcements/${d.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                      </a>
                      {
                        d.status === 'pending' &&
                        <>
                          <ModalBoxButton className="btn btn-success ms-1 btn-action-announcement mt-1" callback={() => setModalContent({
                            title: 'Konfirmasi setuju!',
                            content: <span>Yakin ingin setujui pengumuman ini? ({d.judul})</span>,
                            callback: () =>  singleExecute('approveAnnouncements', d.id)
                          })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>
                          </ModalBoxButton>
                          <ModalBoxButton className="btn btn-danger ms-1 mt-1 btn-action-announcement" callback={() => setModalContent({
                            title: 'Konfirmasi tolak!',
                            content: <span>Yakin ingin tolak pengumuman ini? ({d.judul})</span>,
                            callback: () =>  singleExecute('denyAnnouncements', d.id)
                          })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                          </ModalBoxButton>
                        </>
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          <PaginateButton datas={data.getAnnouncements.links} handleChangePage={handleChangePage} />
          </>
          :
          <h1 className='text-center'>Tidak ada pengumuman</h1>
      }
      <ModalBox title={modalContent.title} callback={modalContent.callback}>
        {modalContent.content }
      </ModalBox>
    </Container>
  )
}

export default Announcement