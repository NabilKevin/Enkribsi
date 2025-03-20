/* eslint-disable react/prop-types */
import { Container, Loading, ModalBoxButton, ModalBox } from '@/components'
import { TableHr } from "@/components/Dashboard/Hr";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from '@/services/HrService'
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';

const Office = ({children, setShowPopup}) => {
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
    singleExecute('getOffices')
    handleInPopup({title: 'Sukses!', content: e?.message, setShowPopup})
  }

const {data, singleExecute} = useMultipleFetch({fetchs: [HrService.getOffices, HrService.deleteOffice], setLoading,
    errorCallbackMap: {
      getOffices: handleError,
      deleteOffice: handleError,
    },
    successCallbackMap: {
      deleteOffice: handleSuccess
    }
  })

  useEffect(() => {
    import('@/css/dashboard/hr/office/index.css')
    singleExecute('getOffices')
  }, [])
    
  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-5'>Kantor</h1>
      <div className="d-flex justify-content-between mb-3 align-items-center header-text-office">
        <h2>List Kantor</h2>
        <a className='btn btn-dark' href="/hr/offices/create">Buat Kantor</a>
      </div>
      <hr />
      {
        data?.getOffices?.length > 0 ? 
          <TableHr>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col' className='text-capitalize'>{data?.getOffices ? 'nama' : ''}</th>
                <th scope='col'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {
                data.getOffices.map((d, i) => (
                  <tr key={i}>
                    <td>{i+1}</td>
                    <td className='scroll'>{data?.getOffices ? d['nama'].length > 27 ? d['nama'].slice(0,27) + '...' : d['nama'] : ''}</td>
                    <td>
                      <ModalBoxButton className="btn btn-dark ms-1 mt-1 btn-action-office" callback={() => setModalContent({
                        title: 'Detail Kantor',
                        content: 
                        (
                          <div className="px-2">
                            {
                              data?.getOffices && Object.keys(data?.getOffices[0]).map((value, i) => 
                              value !== 'id' && (<div key={i} className="d-flex flex-column gap-1 mb-2">
                                <span className="fw-medium fs-5 text-capitalize">{value.split('_').join(' ')} :</span>
                                <span className="text-capitalize">{d?.[value] && typeof(d?.[value]) !== 'object' ? d?.[value] : '-'}{value.toLowerCase() === 'radius' ? 'm' : ''}</span>
                              </div>)
                              ) 
                            }
                          </div>
                        ),
                        callback: () => {}
                      })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                      </ModalBoxButton>
                      <a className="btn btn-primary ms-1 btn-action-office mt-1" href={`/hr/offices/${d.id}/edit`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                      </a>
                      <ModalBoxButton className="btn btn-danger ms-1 mt-1 btn-action-office" callback={() => setModalContent({
                        title: 'Konfirmasi hapus',
                        content: <span>Yakin ingin menghapus Kantor ini? ({d.name})</span>,
                        callback: () =>  singleExecute('deleteOffice', d.id)
                      })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </ModalBoxButton>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </TableHr>
          :
          <h1 className='text-center'>Tidak ada Kantor</h1>
      }
      <ModalBox title={modalContent.title} callback={modalContent.callback}>
        {modalContent.content }
      </ModalBox>
    </Container>
  )
}

export default Office