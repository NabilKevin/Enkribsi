/* eslint-disable react/prop-types */
import { Container, Loading } from '@/components'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from '@/services/HrService'
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';
import { useParams } from 'react-router-dom';

const Edit = ({setShowPopup, children, setIsNotfound}) => {
  const {id} = useParams()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    description: ''
  })
  const [error, setError] = useState({})

  const handleError = e => {
    if(e.status === 404) {
      setIsNotfound(true)
    }
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    setError(e.response?.data)
  }
  const handleSuccess = () => {
    location.replace('/hr/wfh/schedules')
  }
  const handleSuccessGet = e => {
    setFormData({...e})
    
  }
  const {singleExecute} = useMultipleFetch({fetchs: [HrService.editWfhSchedule, HrService.getWfhSchedule], setLoading, 
    errorCallbackMap: {
      editWfhSchedule: handleError,
      getWfhSchedule: handleError,
    },
    successCallbackMap: {
      editWfhSchedule: handleSuccess,
      getWfhSchedule: handleSuccessGet
    }
  })


  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value 
    }))
  }

  const handleSubmit = e => {
    e.preventDefault();
    const d = {...formData}
    for(const dat in d) {
      if(d[dat] === '') {
        delete d[dat]
      }
    }
    
    singleExecute('editWfhSchedule', {data: d, id})
  }

  useEffect(() => {
    import('@/css/dashboard/hr/wfhschedule/index.css')
    singleExecute('getWfhSchedule', id)
  }, [])

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-4'>Edit jadwal</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        
      <div className="mb-3">
          <label htmlFor="tanggalAwalInput" className="form-label">Tanggal awal</label>
          <input type="date" className={`form-control ${error?.errors?.start_date ? 'is-invalid' : ''}`} id="tanggalAwalInput" name='start_date' onChange={handleChange} value={formData.start_date} />
          {
            error?.errors?.start_date && 
            <div className="invalid-feedback">
              {error.errors.start_date}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="tanggalAkhirInput" className="form-label">Tanggal akhir</label>
          <input type="date" className={`form-control ${error?.errors?.end_date ? 'is-invalid' : ''}`} id="tanggalAkhirInput" name='end_date' onChange={handleChange} value={formData.end_date} />
          {
            error?.errors?.end_date && 
            <div className="invalid-feedback">
              {error.errors.end_date}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="descriptionInput" className="form-label">Deskripsi</label>
          <textarea className={`form-control ${error?.errors?.description ? 'is-invalid' : ''}`} id="descriptionInput" name='description' onChange={handleChange} value={formData.description}></textarea>
          {
            error?.errors?.description && 
            <div className="invalid-feedback">
              {error.errors.description}
            </div>
          }
        </div>

        <div className="col-12">
          <button className="btn btn-dark" type="submit">Kirim</button>
        </div>
      </form>
    </Container>
  )
}

export default Edit