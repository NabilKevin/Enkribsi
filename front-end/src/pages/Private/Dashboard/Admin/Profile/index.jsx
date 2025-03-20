/* eslint-disable react/prop-types */
import { Card, Container, Loading } from '@/components'
import { useEffect, useState } from 'react'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import UserService from "@/services/UserService"
import { handleInPopup } from "@/utils/Popup"

const Profile = ({setShowPopup, children}) => {
  const [loading, setLoading] = useState(true)

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
  const handleSuccess = () => {
    location.replace('/login')
  }

  const {data, singleExecute} = useMultipleFetch({fetchs: [UserService.getAuth, UserService.logout], setLoading,
    errorCallbackMap: {
      getAuth: handleError,
      logout: handleError,
    },
    successCallbackMap: {
      logout: handleSuccess
    }
  })

  useEffect(() => {
    import('@/css/dashboard/hr/profile/index.css')
    singleExecute('getAuth')
  }, [])
  
  if(loading) {
    return <Loading />
  }
  return (
    <Container addClass='d-flex flex-column gap-4'>
      {children}
      <div className="rounded-circle align-self-center bg-secondary p-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="bi bi-person-fill" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
      </div>
      <Card>
        <div className="card-body">
          <div className="mb-3 row">
            <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Email</label>
            <div className="col-sm-9">
              <input type="text" readOnly className="form-control" id="staticEmail" value={data?.getAuth?.email} />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Username</label>
            <div className="col-sm-9">
              <input type="text" readOnly className="form-control" id="staticEmail" value={data?.getAuth?.username} />
            </div>
          </div>
          <div className="mb-3">
            <button className="btn btn-dark w-100" onClick={() => singleExecute('logout')}>Logout</button>
          </div>
        </div>
      </Card>
    </Container>
  )
}

export default Profile