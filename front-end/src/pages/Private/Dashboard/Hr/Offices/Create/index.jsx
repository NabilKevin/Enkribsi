/* eslint-disable react/prop-types */
import { Container, Loading } from '@/components'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from '@/services/HrService'
import { useState } from 'react';
import { handleInPopup } from '@/utils/Popup';

const Create = ({setShowPopup, children}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: '',
    work_type: 'wfo'
  })
  const [error, setError] = useState({})

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    setError(e.response?.data)
  }
  const handleSuccess = () => {
    location.replace('/hr/Offices')
  }
  const {execute} = useMultipleFetch({fetchs: [HrService.createOffice], setLoading, 
    errorCallbackMap: {
      createOffice: handleError
    },
    successCallbackMap: {
      createOffice: handleSuccess
    }
  })

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: !isNaN(e.target.value) && e.target.value ? parseFloat(e.target.value) : e.target.value 
    }))
  }

  const handleSubmit = e => {
    e.preventDefault();
    execute(formData) 
  }

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-4'>Buat kantor</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="namaInput" className="form-label">Nama</label>
          <input type="text" className={`form-control ${error?.errors?.name ? 'is-invalid' : ''}`} id="namaInput" name='name' onChange={handleChange} value={formData.name} required />
          {
            error?.errors?.name && 
            <div className="invalid-feedback">
              {error.errors.name}
            </div>
          }
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="targetInput" className="form-label">Tipe Kerja</label>
          <select className={`form-select ${error?.errors?.work_type ? 'is-invalid' : ''}`} id="targetInput" name='work_type' onChange={handleChange} value={formData.work_type} required>
            <option value='wfo'>WFO (Work From Office)</option>
            <option value='wfh'>WFH (Work From Home)</option>
            <option value='wfa'>WFA (Work From Anywhere)</option>
          </select>
          {
            error?.errors?.work_type && 
            <div className="invalid-feedback">
              {error.errors.work_type}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="latitudeInput" className="form-label">Latitude</label>
          <input required type="number" step='0.01' className={`form-control ${error?.errors?.latitude ? 'is-invalid' : ''}`} id="latitudeInput" name='latitude' onChange={handleChange} value={formData.latitude} />
          {
            error?.errors?.latitude && 
            <div className="invalid-feedback">
              {error.errors.latitude}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="longitudeInput" className="form-label">Longitude</label>
          <input type="number" step='0.01' className={`form-control ${error?.errors?.longitude ? 'is-invalid' : ''}`} id="longitudeInput" name='longitude' onChange={handleChange} value={formData.longitude} required />
          {
            error?.errors?.longitude && 
            <div className="invalid-feedback">
              {error.errors.longitude}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="radiusInput" className="form-label">Radius (radius untuk absen dalam bentuk meter)</label>
          <input type="number" className={`form-control ${error?.errors?.radius ? 'is-invalid' : ''}`} id="radiusInput" name='radius' onChange={handleChange} value={formData.radius} required />
          {
            error?.errors?.radius && 
            <div className="invalid-feedback">
              {error.errors.radius}
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

export default Create