const Login = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 gap-4 flex-column">
            <div className="img">
              <h2 className="text-center mb-4">Enkripsi</h2>
              <p className="text-center text-muted">Smart Attendance For Employee</p>
            </div>
        <div className="p-4 w-100" style={{maxWidth: "600px"}}>
            <form>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="floatingInput" placeholder="Username or Email address"/>
              <label htmlFor="floatingInput">Username or Email address</label>
            </div>
            <div className="form-floating mb-2">
              <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">Remember Me</label>
            </div>
                <button type="submit" className="btn btn-danger w-100">Login</button>
                <div className="text-center mt-3 d-flex align-items-center justify-content-between">
                    <span>Dont have an <a href="#" className="text-muted"> account?</a> </span> 
                     <a href="#" className="text-muted">Forgot password?</a>
                </div>
            </form>
        </div>
    </div>
  );
};
export default Login;
