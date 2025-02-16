/* eslint-disable react/prop-types */
import  {useNavigate} from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { BASE_URL_API } from "@/config";
import { API_ENDPOINTS } from "../../../config";

const Login = ({checkAuth}) => {
  const navigate = useNavigate();
  const [error, setError] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const authdata = {}
      Array.from(e.target).forEach(e => {
        if(e.tagName.toLowerCase() !== 'button') {
          if(e.type.toLowerCase() === 'checkbox') {
            authdata[e.name] = e.checked
          } else {
            authdata[e.name] = e.value
          }
        }
      })
      
      await axios.post(`${BASE_URL_API}${API_ENDPOINTS.LOGIN}`, authdata)
      navigate('/')
      checkAuth()
    } catch(err) {
      
      setError(err.response?.data);
    }
  }
  return (
<div className="container d-flex align-items-center gap-4 flex-column p-4 pt-1 mt-5">
        <div>
          <h2 className="text-center mb-4">Enkribsi</h2>
          <p className="text-center text-muted">Smart Attendance For Employee</p>
        </div>
        <div className="p-4 pt-0 w-100" style={{maxWidth: "600px"}}>
          {error?.message && <div className="alert alert-danger">
            {error?.message}
          </div>}
          <h3 className="mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="email" className={`form-control ${error?.errors?.email ? 'is-invalid' : ''}`} id="floatingInput" placeholder="email or Email address" name="email" required/>
              <label htmlFor="floatingInput">Email </label>
              {
                error?.errors?.email && <div className="invalid-feedback">
                  {error?.errors?.email}
                </div>
              }
            </div>
            <div className="form-floating mb-2">
              <input autoComplete="off" type="password" className={`form-control ${error?.errors?.password ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" name="password" required/>
              <label htmlFor="floatingPassword">Password</label>
              {
                error?.errors?.password && <div className="invalid-feedback">
                  {error?.errors?.password}
                </div>
              }
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" value="" name="remember_me" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">Remember Me</label>
            </div>
                <button type="submit" className="btn btn-danger w-100">Login</button>
            </form>
        </div>
    </div>
  );
};
export default Login;
