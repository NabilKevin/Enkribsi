/* eslint-disable react/prop-types */
import { Container, Loading } from '@/components'
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import HrService from '@/services/HrService'
import { useEffect, useState } from 'react';
import { handleInPopup } from '@/utils/Popup';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Create = ({setShowPopup, children}) => {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    office_id: 1,
    check_in_time: new Date(),
    check_out_time: new Date(),
    expired_date: '',
  })
  const [error, setError] = useState({})

  const handleTimeChange = ({time, name}) => {
    setFormData(prev => ({
      ...prev,
      [name]: time
    }));
  };

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    setError(e.response?.data)
  }
  const handleSuccess = () => {
    location.replace('/hr/schedules')
  }
  const {data, singleExecute} = useMultipleFetch({fetchs: [HrService.createSchedule, HrService.getOffices], setLoading, 
    errorCallbackMap: {
      createSchedule: handleError,
      getOffices: handleError
    },
    successCallbackMap: {
      createSchedule: handleSuccess
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
    const d = {...formData}
    for(const dat in d) {
      if(dat.includes('time')) {
        const date = new Date(d[dat])
        d[dat] = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
      }
      if(d[dat] === '') {
        delete d[dat]
      }
    }
    
    singleExecute('createSchedule', d)
  }

  useEffect(() => {
    import('@/css/dashboard/hr/schedule/index.css')
    singleExecute('getOffices')
  }, [])

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
      {children}
      <h1 className='mb-4'>Buat jadwal</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="col-md-3 mb-3">
          <label htmlFor="targetInput" className="form-label">Kantor</label>
          <select className={`form-select ${error?.errors?.office_id ? 'is-invalid' : ''}`} id="targetInput" name='office_id' onChange={handleChange} value={formData.office_id}>
            {
              data?.getOffices && data.getOffices.map((office, i) => (
                <option key={i} value={office?.id}>{office?.name}</option>
              ))
            }
          </select>
          {
            error?.errors?.office_id && 
            <div className="invalid-feedback">
              {error.errors.office_id}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="checkInTimeInput">Jam Masuk</label>
          <DatePicker
            selected={formData.check_in_time}
            onChange={time => handleTimeChange({time, name: 'check_in_time'})}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            dateFormat="HH:mm:ss"
            timeCaption="Time"
            className={`form-control ${error?.errors?.check_in_time ? 'is-invalid' : ''}`}
            name='check_in_time'
            required
            id='checkInTimeInput'
          />
          {
            error?.errors?.check_in_time && 
            <div className="text-danger mt-2">
              {error.errors.check_in_time}
            </div>
          }
        </div>
        <div className="mb-3">
        <label htmlFor="checkOutTimeInput">Jam Pulang</label>
          <DatePicker
            selected={formData.check_out_time}
            onChange={time => handleTimeChange({time, name: 'check_out_time'})}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            dateFormat="HH:mm:ss"
            timeCaption="Time"
            className={`form-control ${error?.errors?.check_out_time ? 'is-invalid' : ''}`}
            name='check_out_time'
            id='checkOutTimeInput'
            required
          />
          {
            error?.errors?.check_out_time && 
            <div className="text-danger mt-2">
              {error.errors.check_out_time}
            </div>
          }
        </div>
        <div className="mb-3">
          <label htmlFor="tanggalExpiredInput" className="form-label">Tanggal Expired</label>
          <input type="date" className={`form-control ${error?.errors?.expired_date ? 'is-invalid' : ''}`} id="tanggalExpiredInput" name='expired_date' onChange={handleChange} value={formData.expired_date} />
          {
            error?.errors?.expired_date && 
            <div className="invalid-feedback">
              {error.errors.expired_date}
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