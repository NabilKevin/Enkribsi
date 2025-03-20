/* eslint-disable react/prop-types */
import { Container, Loading } from '@/components'
import { useEffect, useState } from 'react'
import UserService from "@/services/UserService";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { handleInPopup } from '@/utils/Popup';

const Forgotpassword = ({children, setShowPopup}) => {
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState({maxLength: null, label: 'Email address', placeholder: 'name@example.com', name: 'email', type: 'email'})
  const [formData, setFormData] = useState({email: ''})
  const [timeToken, setTimeToken] = useState()
  const [time, setTime] = useState()

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const changeInputToVerifCode = () => {
    setInput({
      maxLength: 6,
      label: 'Verifikasi Kode',
      placeholder: 'Masukkan kode',
      name: 'token',
      type: 'text'
    })
  }
  const changeInputToPassword = () => {
    setInput({
      maxLength: null,
      label: 'Ganti password',
      placeholder: 'Password',
      name: 'password',
      type: 'password'
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    
    if(Object.keys(formData).length === 0) {
      handleInPopup({title: 'Peringatan!', content: 'Anda harus mengisi input form', setShowPopup})
    } else {
      let url = ''
      if(Object.keys(formData)[0] === 'email') {
        url = 'submitEmailForgot'
      } else if (Object.keys(formData)[0] === 'token') {
        url = 'submitTokenForgot'
      } else {
        url = 'changePassword'
      }
      singleExecute(url, formData)
      setLoading(true)
    }
    
  }

  const isDisabledButton = () => {
    let retData = ''
    if(Object.keys(formData).length === 0) {
      retData = 'disabled'
    } else {
      [...Object.keys(formData)].map(key => {
        if(formData[key] === '') {
          retData = 'disabled'
        }
      })
    }
    return retData
  }

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    setLoading(false)
  }
  const handleSuccess = e => {
    const d = {...e.data}
    
    for(const key in d) {
      if(key === 'time') {
        setTimeToken(d[key])
      }
    }
    const url = e.request.__URL__.split('/')
    
    if(url[url.length-1].toLowerCase() === 'forgotpassword') {
      changeInputToVerifCode()
      setFormData({token: ''})
      setLoading(false)
    } else if(url[url.length-1].toLowerCase() === 'forgotpasswordtoken') {
      changeInputToPassword()
      setFormData({password: '', password_confirmation: ''})
      setLoading(false)
    } else {
      location.replace('/login')
    }
  }

  const handleErrorCheckSubmit = e => {
    if(e.status === 403) {
      setLoading(false)
    }
  }

  const handleSuccessCheckSubmit = e => {
    const d = {...e.data}
    for(const key in d) {
      if(key === 'time') {
        setTimeToken(d[key])
      }
    }
    const url = e.request.__URL__.split('/')

    if(url[url.length-1].toLowerCase() === 'email') {
      changeInputToVerifCode()
      setFormData({token: ''})
      singleExecute('checkSubmitCode')
    } else if(url[url.length-1].toLowerCase() === 'verifcode') {
      changeInputToPassword()
      setFormData({password: '', password_confirmation: ''})
      setLoading(false)
    }
  }

  const { singleExecute } = useMultipleFetch({fetchs: [
    UserService.submitEmailForgot,
    UserService.submitTokenForgot,
    UserService.changePassword,
    UserService.checkSubmitEmail,
    UserService.checkSubmitCode
  ], 
    errorCallbackMap: {
      checkSubmitEmail: handleErrorCheckSubmit,
      submitEmailForgot: handleError,
      submitTokenForgot: handleError,
      changePassword: handleError,
      checkSubmitCode: handleErrorCheckSubmit
    },
    successCallbackMap: {
      checkSubmitEmail: handleSuccessCheckSubmit,
      submitEmailForgot: handleSuccess,
      submitTokenForgot: handleSuccess,
      changePassword: handleSuccess,
      checkSubmitCode: handleSuccessCheckSubmit
    }
  });
  const handleResend = () => {
    singleExecute('submitEmailForgot')
    setLoading(true)
  }

  useEffect(() => {
    import('@/css/forgotpassword/index.css')
    singleExecute('checkSubmitEmail')
  }, [])
  
  useEffect(() => {
    if(timeToken) {
      if((new Date(timeToken).getTime() - new Date().getTime())/1000 <= 0) {
        setTime('Kirim ulang')
      } else {
        const inter = setInterval(()=>{
          if((new Date(timeToken).getTime() - new Date().getTime())/1000 <= 0) {
            clearInterval(inter)
            setTime('Kirim ulang')
          } else {
            setTime((new Date(timeToken).getTime() - new Date().getTime())/1000)
          }
        }, 1000)
      }
    }
  }, [timeToken])
  if(loading) {
    return <Loading />
  }
  return (
    <Container addClass="d-flex align-items-center h-100 flex-column gap-4 mt-5 px-4">
      {children}
      <div className='mb-5'>
        <h1 className="text-center title" style={{ fontSize: '50px' }}>Enkribsi</h1>
        <p className="text-center text-muted" style={{ fontSize: '13px' }}>Smart Attendance For Employee</p>
      </div>
      <form className='w-100 mt-5' onSubmit={handleSubmit}>
        <label htmlFor="input1" className="form-label"><h4>{input.label}</h4></label>
        <div className="mb-3 w-100 input-group">
          <input type={input.type} className="form-control py-25" id="input1" placeholder={input.placeholder} maxLength={input.maxLength} name={input.name} onChange={handleChange} value={formData?.[input.name]}/>
          {
            input.name.toLowerCase() === 'token' &&
            <button onClick={handleResend} className={`btn btn-outline-dark ${isNaN(time) ? '' : 'disabled'}`} type="button" id="button1">{isNaN(time) ? time : time.toFixed(0)}</button>
          }
        </div>
        {
          input.label.toLowerCase() === 'ganti password' &&
          <div className="mb-3 w-100">
            <input type="password" className="form-control py-25" id="input2" placeholder="Konfirmasi passowrd" name='password_confirmation' onChange={handleChange} value={formData?.['password_confirmation']}/>
          </div>
        }
        <button className={`btn btn-danger w-100 fw-medium py-25 ${isDisabledButton()}`}>Lanjut</button>
      </form>
    </Container>
  )
}

export default Forgotpassword