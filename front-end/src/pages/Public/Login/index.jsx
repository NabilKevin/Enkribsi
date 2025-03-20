/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { Loading } from '@/components';

const Login = ({checkAuth}) => {
  const [error, setError] = useState()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false
  })
  const [loading, setLoading] = useState(false)

  const handleErrorLogin = (e) => {
    setError(e.response?.data);
  }

  const handleSuccessLogin = () => {
    location.replace('/')
    checkAuth()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type.toLowerCase() === 'checkbox' ? e.target.checked : e.target.value
    })
  }

  const { execute: login } = useMultipleFetch({fetchs: [UserService.handleLogin], setLoading, 
  errorCallbackMap: {
    handleLogin: handleErrorLogin
  }, 
  successCallbackMap: {
    handleLogin: handleSuccessLogin
  }});

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(formData)
  }

  useEffect(() => {
    import('@/css/forgotpassword/index.css')
  }, [])

  if(loading) {
    return <Loading />
  }
  
  return (
      <div className="container d-flex align-items-center gap-4 flex-column p-4 pt-1 mt-4">
        <div className='mb-4'>
          <h1 className="text-center title" style={{ fontSize: '50px' }}>Enkribsi</h1>
          <p className="text-center text-muted" style={{ fontSize: '13px' }}>Smart Attendance For Employee</p>
        </div>
        <div className="py-4 px-2 pt-0 w-100" style={{maxWidth: "600px"}}>
          {error?.message && <div className="alert alert-danger">
            {error?.message}
          </div>}
          <h3 className="mb-4">Login</h3>
            <form onSubmit={handleSubmit} className="mb-2">
            <div className="form-floating mb-3">
              <input value={formData.email} onInput={handleChange} autoComplete="off" type="email" className={`form-control ${error?.errors?.email ? 'is-invalid' : ''}`} id="floatingInput" placeholder="email or Email address" name="email" required/>
              <label htmlFor="floatingInput">Email </label>
              {
                error?.errors?.email && <div className="invalid-feedback">
                  {error?.errors?.email}
                </div>
              }
            </div>
            <div className="form-floating mb-2">
              <input value={formData.password} onInput={handleChange} autoComplete="off" type="password" className={`form-control ${error?.errors?.password ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" name="password" required/>
              <label htmlFor="floatingPassword">Password</label>
              {
                error?.errors?.password && <div className="invalid-feedback">
                  {error?.errors?.password}
                </div>
              }
            </div>
            <div className="form-check mb-3">
              <input value={formData.remember_me} onInput={handleChange} className="form-check-input" type="checkbox" name="remember_me" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">Remember Me</label>
            </div>
                <button type="submit" className="btn btn-danger w-100">Login</button>
            </form>
            <span>Lupa password? <a href="/forgotpassword" className="text-dark">klik disini</a></span>
        </div>
    </div>
  );
};
export default Login;