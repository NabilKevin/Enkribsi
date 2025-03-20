/* eslint-disable react/prop-types */
import { Container, Loading } from '@/components'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';
import AdminService from '@/services/AdminService';
import { useParams } from 'react-router-dom';

const Edit = ({setShowPopup, children, setIsNotfound}) => {
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    role: 'admin'
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
    location.replace('/admin')
  }
  const handleSuccessUser = e => {
    const data = {
      email: e.email,
      username: e.username,
      role: e.role
    }

    if(Object.keys(e).includes('leader_id')) {
      data['leader_id'] = e.leader_id
    }
    setFormData(data)
    
  }
  const {data, singleExecute} = useMultipleFetch({fetchs: [AdminService.editUser, AdminService.getBods, AdminService.getUser], setLoading, 
    errorCallbackMap: {
      editUser: handleError,
      getBods: handleError,
      getUser: handleError
    },
    successCallbackMap: {
      editUser: handleSuccess,
      getUser: handleSuccessUser
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
    singleExecute('editUser', formData, id)
  }

  useEffect(() => {
    singleExecute('getBods')
    singleExecute('getUser', id)
  }, [])
  useEffect(() => {
    if(formData.role !== 'bod' && formData.role !== 'admin') {
      setFormData(prev => ({
        ...prev,
        leader_id: data.getBods[0].id
      }))
    } else {
      const data = {...formData}
      if(Object.keys(data).includes('leader_id')) {
        delete data.leader_id
        setFormData(data)
      }
    }
  }, [formData.role])

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-4'>Buat user</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email</label>
          <input type="email" className={`form-control ${error?.errors?.email ? 'is-invalid' : ''}`} id="emailInput" name='email' onChange={handleChange} value={formData.email} required />
          {
            error?.errors?.email && 
            <div className="invalid-feedback">
              {error.errors.email}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">Username</label>
          <input type="text" className={`form-control ${error?.errors?.username ? 'is-invalid' : ''}`} id="usernameInput" name='username' onChange={handleChange} value={formData.username} required />
          {
            error?.errors?.username && 
            <div className="invalid-feedback">
              {error.errors.username}
            </div>
          }
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="targetInput" className="form-label">Role</label>
          <select className={`form-select ${error?.errors?.role ? 'is-invalid' : ''}`} id="targetInput" name='role' onChange={handleChange} value={formData.role} required>
            <option value='admin'>Admin</option>
            <option value='bod'>BOD</option>
            <option value='hr'>HR</option>
            <option value='user'>Pegawai</option>
          </select>
          {
            error?.errors?.role && 
            <div className="invalid-feedback">
              {error.errors.role}
            </div>
          }
        </div>
        {
          formData.role !== 'bod' && formData.role !== 'admin' &&
        <div className="col-md-3 mb-3">
          <label htmlFor="leaderInput" className="form-label">Atasan</label>
          <select className={`form-select ${error?.errors?.leader_id ? 'is-invalid' : ''}`} id="leaderInput" name='leader_id' onChange={handleChange} value={formData.leader_id} required>
            {
              data?.getBods && [...data.getBods].map((d, i) => (
                <option key={i} value={d.id}>{d.user.username}</option>
              ))
            }
          </select>
          {
            error?.errors?.leader_id && 
            <div className="invalid-feedback">
              {error.errors.leader_id}
            </div>
          }
        </div>
        }
        <div className="col-12">
          <button className="btn btn-dark" type="submit">Kirim</button>
        </div>
      </form>
    </Container>
  )
}

export default Edit