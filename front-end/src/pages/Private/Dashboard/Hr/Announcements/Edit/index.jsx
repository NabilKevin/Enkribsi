/* eslint-disable react/prop-types */
import { Container, Loading, QuillEditor } from '@/components'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from '@/services/HrService'
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';
import { useParams } from 'react-router-dom';

const Edit = ({setShowPopup, children}) => {
  const {slug} = useParams()
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
  const handleSuccessGet = e => {
    const { judul, isi_pengumuman, target_audiens } = e
      setFormData({
        title: judul,
        target_audience: target_audiens.id
      })
      setContent(isi_pengumuman)
  }
  const {data, singleExecute} = useMultipleFetch({fetchs: [HrService.getAnnouncement, HrService.getAudiences, HrService.editAnnouncement], setLoading, 
    errorCallbackMap: {
      getAnnouncement: handleError,
      editAnnouncement: handleError,
      getAudiences: handleError
    },
    successCallbackMap: {
      editAnnouncement: handleSuccess,
      getAnnouncement: handleSuccessGet
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

    singleExecute('editAnnouncement', {data, slug})
    
  }

  useEffect(() => {
    singleExecute('getAnnouncement', slug)
    singleExecute('getAudiences', slug)
  }, [])

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-4'>Edit pengumuman</h1>
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
          <QuillEditor setContent={setContent} content={content} />
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
          <button className="btn btn-dark" type="submit">Ubah</button>
        </div>
      </form>
    </Container>
  )
}

export default Edit