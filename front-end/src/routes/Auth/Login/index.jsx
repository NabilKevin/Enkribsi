import  {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const AuthController = async (e) => {
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
      const response = await axios.post(`http://localhost:8000/api/auth/login`, authdata)
      const data = response.data;
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch(err) {
     console.log(err);
     
      // setError(err.response.data);
    }
  }
  return (
<div className="container d-flex align-items-center vh-100 gap-4 flex-column p-4">
            <div className="img mt-5">
              <h2 className="text-center mb-4">Enkribsi</h2>
              <p className="text-center text-muted">Smart Attendance For Employee</p>
            </div>
        <div className="p-4 w-100" style={{maxWidth: "600px"}}>
          <h3 className="mb-4">Login</h3>
            <form onSubmit={AuthController}>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="text" className="form-control" id="floatingInput" placeholder="Username or Email address" name="username" required/>
              <label htmlFor="floatingInput">Username </label>
            </div>
            <div className="form-floating mb-2">
              <input autoComplete="off" type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password" required/>
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">Remember Me</label>
            </div>
                <button type="submit" className="btn btn-danger w-100">Login</button>
                <div className="text-center mt-3 d-flex align-items-center justify-content-between">
                    <span>Dont have an account?<a href="/register" className="text-muted"> Register here!</a> </span> 
                     
                </div>
            </form>
        </div>
    </div>
  );
};
export default Login;
