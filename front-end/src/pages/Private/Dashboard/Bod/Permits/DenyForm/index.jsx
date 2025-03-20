/* eslint-disable react/prop-types */
import { Container, Loading } from '@/components'
import { useParams } from 'react-router-dom'
import BodService from '@/services/BodService'
import { useEffect, useState } from 'react'
import { useMultipleFetch } from "@/hooks/useMultipleFetch"
import { handleInPopup } from '@/utils/Popup'

const DenyForm = ({children, setShowPopup, setIsNotfound}) => {
  const {id} = useParams()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    bod_reason: ''
  })

  const handleError = e => {
    if(e.status === 404) {
      setIsNotfound(true)
    }
    
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const handleSuccessGet = data =>{
    setFormData(prev => ({...prev, username: data.user.username}))
  }

  const handleSuccessDeny = () => {
    location.replace('/bod')
  }

  const { singleExecute } = useMultipleFetch({fetchs: [BodService.denyPermits, BodService.getPermit], setLoading,
    errorCallbackMap: {
      getPermit: handleError,
      denyPermits: handleError
    },
    successCallbackMap: {
      getPermit: handleSuccessGet,
      denyPermits: handleSuccessDeny
    }
  })

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = () => {
    singleExecute('denyPermits', {id, data: formData})
  }

  useEffect(() => {
    singleExecute('getPermit', id)
  }, [])

  if(loading) {
    return <Loading />
  }
  return (
    <Container>
      {children}
      <h1>Menolak izin</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="usernameInput1" className="form-label">Username</label>
          <input type="text" readOnly className="form-control" id="usernameInput1" name='username' value={formData.username} />
        </div>
        <div className="mb-3">
          <label htmlFor="textArea1" className="form-label">Textarea</label>
          <textarea className="form-control" id="textArea1" placeholder="Alasan..." name='bod_reason' required style={{ height: '200px' }} value={formData.bod_reason} onChange={handleChange}></textarea>
        </div>
        <button className='btn btn-dark' type='submit'>Kirim</button>
      </form>
    </Container>
  )
}

export default DenyForm