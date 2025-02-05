import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {FirstPage2, LastPage2, Page1, Page3} from "./pages";

const Register = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [changePage,setChangePage] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [authData, setAuthData] = useState({  
    email: "",
    username: "",
    password: "",
    face_img: photo
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
      setChangePage(2);
    }
  }

  const handleClickBack = (page) => {
    setChangePage(page);
  }

  const startWebcam = () => {
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
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    if(changePage === 2) {
      startWebcam();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        stopWebcam();
      }
    }
  }, [changePage])


  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setPhoto(imageData); 
      authData.face_img = imageData;
      stopWebcam();
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startWebcam(); 
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', authData)
      const data = response.data;
      console.log(data);
      
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="container d-flex align-items-center vh-100 gap-4 flex-column p-4">
      {
        changePage === 1 ? <Page1 authData={authData} handleChangeInput={handleChangeInput} handleClickLanjut={handleClickLanjut} /> : changePage === 2 ? !photo ? 
        <FirstPage2 videoRef={videoRef} canvasRef={canvasRef} takePhoto={takePhoto} handleClickBack={handleClickBack} /> : 
        <LastPage2 photo={photo} retakePhoto={retakePhoto} setChangePage={setChangePage} /> : 
        <Page3 authData={authData} handleChangeInput={handleChangeInput} photo={photo} handleSubmit={handleSubmit} />
      }
    </div>
  );
};
export default Register;
