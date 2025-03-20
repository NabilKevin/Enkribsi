/* eslint-disable react/prop-types */
import { Container, Loading, QuillEditor } from '@/components'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from '@/services/HrService'
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';

const Create = ({setShowPopup, children}) => {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState()
  const [formData, setFormData] = useState({
    title: '',
    target_audience: ''
  })
  const [error, setError] = useState({})

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    setError(e.response?.data)
  }
  const handleSuccess = () => {
    location.replace('/hr/announcements')
  }
  const {data, singleExecute} = useMultipleFetch({fetchs: [HrService.getAudiences, HrService.createAnnouncement], setLoading, 
    errorCallbackMap: {
      getAudiences: handleError,
      createAnnouncement: handleError
    },
    successCallbackMap: {
      createAnnouncement: handleSuccess
    }
  })

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: !isNaN(e.target.value) && e.target.value ? parseInt(e.target.value) : e.target.value 
    }))
  }

  const handleSubmit = e => {
    e.preventDefault();
    const data = {...formData};
    data['content'] = content

    if(data.target_audience === '') {
      delete data.target_audience
    }

    singleExecute('createAnnouncement', data)
    
  }

  useEffect(() => {
    singleExecute('getAudiences')
  }, [])

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-4'>Buat pengumuman</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="judulInput" className="form-label">Judul</label>
          <input type="text" className={`form-control ${error?.errors?.title ? 'is-invalid' : ''}`} id="judulInput" name='title' onChange={handleChange} value={formData.title} required />
          {
            error?.errors?.title && 
            <div className="invalid-feedback">
              {error.errors.title}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="isiInput" className="form-label">Isi</label>
          <QuillEditor setContent={setContent} />
          {
            error?.errors?.content && 
            <div className="text-danger mt-2">
              {error.errors.content}
            </div>
          }
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="targetInput" className="form-label">Target audiens (Untuk pegawai dari...)</label>
          <select className={`form-select ${error?.errors?.target_audience ? 'is-invalid' : ''}`} id="targetInput" name='target_audience' onChange={handleChange} value={formData.target_audience}>
            <option value=''>Semua</option>
            {
              data?.getAudiences && data.getAudiences.map((audience, i) => (
                <option key={i} value={audience?.user?.id}>{audience?.user?.username}</option>
              ))
            }
          </select>
          {
            error?.errors?.target_audience && 
            <div className="invalid-feedback">
              {error.errors.target_audience}
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