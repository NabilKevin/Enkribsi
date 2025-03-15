/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useMultipleFetch } from "@/hooks/useMultipleFetch"
import { handleInPopup } from '@/utils/Popup'
import { Card, Loading} from "@/components"
import HrService from "@/services/HrService"
import { DateComp } from "@/components/Dashboard/Shared"
import { ModalBox, ModalBoxButton } from "@/components/"

const Home = ({setShowPopup}) => {
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState({})

  const handleErrorPermits = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const { data: permits, execute: setPermits } = useMultipleFetch({fetchs: [HrService.getPermitsHr], setLoading,
    errorCallbackMap: {
      getPermitsHr: handleErrorPermits
    }
  })

  const fetch_data = () => {
    setPermits()
  }
  useEffect(() => {
    import('@/css/dashboard/hr/home/index.css')
    fetch_data()
  }, []);

  if(loading) {
    return <Loading />
  }
  return (
    <>
    <DateComp />
    <Card addClassBody="p-4">
      <h5 className="mb-4">Permintaan Izin Hari Ini</h5>
      {permits?.getPermitsHr?.keys && permits?.getPermitsHr?.permits ? permits?.getPermitsHr?.permits.length === 0 ? 
      <h2 className="text-center mt-4">Tidak ada permintaan izin hari ini</h2>
       : 
       <table className="table table-dark text-center">
        <thead>
          <tr>
          {
            permits?.getPermitsHr?.keys ? Object.values(permits?.getPermitsHr?.keys).map((value, i) => i < 2 && <th scope="col" key={i}>{value}</th>)
              : <></>
          }
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {
            permits?.getPermitsHr?.permits?.map((permit, i) => (
              <tr key={i}>
                {
                  Object.keys(permits?.getPermitsHr?.keys).map((value, ii) => 
                    ii < 2 && 
                    <td key={ii} className="align-content-center">
                      {`${String(permit?.[value]).slice(0, 25)}${permit?.[value].length > 25 ? '...' : ''}`}
                    </td>
                    )
                  }
                  <td>
                  <ModalBoxButton className="btn btn-dark" callback={() => setModalContent(permit)}>Detail</ModalBoxButton>
                  </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      : 
      <></>
      } 
      
      <ModalBox title='Detail izin'>
      <div className="px-2">
        {
          permits?.getPermitsHr?.keys && Object.keys(permits.getPermitsHr.keys).map((value, i) => 
          <div key={i} className="d-flex flex-column gap-1 mb-2">
            <span className="fw-medium fs-5">{permits.getPermitsHr.keys[value]} :</span>
            <span className="text-capitalize">{modalContent?.[value] || '-'}</span>
          </div>
          ) 
        }
        </div>
      </ModalBox>
    </Card>
    </>
  )
}

export default Home