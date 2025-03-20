/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useMultipleFetch } from "@/hooks/useMultipleFetch"
import { handleInPopup } from '@/utils/Popup'
import { Card, Loading} from "@/components"
import BodService from "@/services/BodService"
import { DateComp } from "@/components/Dashboard/Shared"
import { ModalBox, ModalBoxButton, PaginateButton } from "@/components/"

const Home = ({setShowPopup, children}) => {
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({
    body: '',
    title: '',
    callback: () => {}
  })

  const handleError = e => {
    
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const handleSuccess = e => {
    handleInPopup({title: 'Sukses!', content: e.message, setShowPopup})
    singleExecute('getPermits')
  }

  const { data, singleExecute } = useMultipleFetch({fetchs: [BodService.getPermits, BodService.approvePermits], setLoading,
    errorCallbackMap: {
      getPermits: handleError,
      approvePermits: handleError
    },
    successCallbackMap: {
      approvePermits: handleSuccess
    }
  })

  const handleChangePage = (page = 1) => {
    singleExecute('getPermits', page)
  }

  const fetch_data = () => {
    singleExecute('getPermits')
  }
  useEffect(() => {
    import('@/css/dashboard/hr/home/index.css')
    import('@/css/dashboard/bod/home/index.css')
    fetch_data()
  }, []);

  if(loading) {
    return <Loading />
  }
  return (
    <>
    {children}
    <DateComp />
    <Card addClassBody="p-4">
      <h5 className="mb-4">Permintaan Izin Hari Ini</h5>
      {data?.getPermits?.keys && data?.getPermits?.permits ? data?.getPermits?.permits?.data?.length === 0 ? 
      <>
      <hr />
      <h2 className="text-center mt-4">Tidak ada permintaan izin hari ini</h2>
      </>
       : 
       <>
       <table className="table table-dark text-center">
        <thead>
          <tr>
          {
            data?.getPermits?.keys ? Object.values(data?.getPermits?.keys).map((value, i) => i < 2 && <th scope="col" key={i}>{value}</th>)
              : <></>
          }
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {
            data?.getPermits?.permits?.data?.map((permit, i) => (
              <tr key={i}>
                {
                  Object.keys(data?.getPermits?.keys).map((value, ii) => 
                    ii < 2 && 
                    <td key={ii} className="align-content-center">
                      {`${String(permit?.[value]).slice(0, 25)}${permit?.[value]?.length > 25 ? '...' : ''}`}
                    </td>
                    )
                  }
                  <td>
                  <ModalBoxButton className="btn btn-primary me-1 mt-1 btn-action" callback={() => setModal(
                    {
                      title: 'Detail izin', 
                      body: data?.getPermits?.keys && Object.keys(data.getPermits.keys).map((value, i) => 
                        <div key={i} className="d-flex flex-column gap-1 mb-2">
                          <span className="fw-medium fs-5">{data.getPermits.keys[value]} :</span>
                          <span className="text-capitalize">{permit?.[value] || '-'}</span>
                        </div>
                        ) ,
                        callback: () => {}
                    }
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </ModalBoxButton>
                  {
                    permit?.status === 'pending' &&
                    <>
                      <ModalBoxButton className="btn btn-success me-1 mt-1 btn-action" callback={() => setModal(
                        {
                          title: 'Konfirmasi setuju!', 
                          body: <span>Anda yakin ingin setujui izin ini?</span>,
                          callback: () => singleExecute('approvePermits', permit?.id)
                        }
                      )}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                        </svg>
                      </ModalBoxButton>
                      <a className="btn btn-danger me-1 mt-1 btn-action" href={`/bod/permits/${permit?.id}/deny`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                      </a>
                    </> 
                  }
                  </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <PaginateButton datas={data.getPermits.permits.links} handleChangePage={handleChangePage} bgdark={true} />
      </>
      : 
      <></>
      } 
      
      <ModalBox title={modal.title} callback={modal.callback}>
      <div className="px-2">
        {modal.body}  
      </div>
      </ModalBox>
    </Card>
    </>
  )
}

export default Home