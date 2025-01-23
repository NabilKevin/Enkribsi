import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [changePage,setChangePage] = useState(false);
  const [authData, setAuthData] = useState({  
    email: "",
    username: "",
    password: "",
  });

  const handleChangeInput = e => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
  }

  const handleClickLanjut = () => {
    if(authData.email === "" || authData.username === "" || authData.password === "") {
      alert("Please fill all the form!");
    } else {
      setChangePage(true);
    }
  }

  useEffect(() => {
    if(changePage) {
      navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  }, [changePage])

  return (
    <div className="container d-flex align-items-center vh-100 gap-4 flex-column p-4">
      {
        !changePage ? <>
        <div className="img mt-5">
          <h2 className="text-center mb-4">Enkribsi</h2>
          <p className="text-center text-muted">Smart Attendance For Employee</p>
        </div>
        <div className="p-4 w-100" style={{ maxWidth: "600px" }}>
          <h3 className="mb-4">Register</h3>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="email" className="form-control" id="floatingInput" placeholder="Email address" name="email" required value={authData.email} onChange={handleChangeInput}/>
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="text" className="form-control" id="floatingInput" placeholder="Username" name="username" required value={authData.username} onChange={handleChangeInput}/>
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password" required value={authData.password} onChange={handleChangeInput} />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button className="btn btn-danger w-100" onClick={handleClickLanjut}>Lanjutkan</button>
            <div className="text-center mt-3 d-flex align-items-center justify-content-between">
              <span>Already have an account? <a href="#" className="text-muted">Login here!</a>
              </span>
            </div>
        </div>
        </> : 
        <>
          <video
            ref={videoRef}
            autoPlay
            className="w-100"
            style={{ height: "700px" }}
          ></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </>
      }
    </div>
  );
};

export default Register;
