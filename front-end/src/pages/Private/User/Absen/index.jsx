/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { BASE_URL_API, API_ENDPOINTS } from "@/config";
import { useNavigate } from "react-router-dom";
import { Webcam, FormAbsen } from "@/components";
import { handleInPopup } from '@/utils/Popup';
import { checkPermission } from '@/utils/Permission';
import { Loading } from "@/components";

const Absen = ({setShowNotificationButton, setShowPopup, children, setIsHomepage}) => {
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [page, setPage] = useState(1)
  const [grant, setGrant] = useState({location: false, webcam: false});
  const [loading, setLoading] = useState(true)
  const [offices, setOffices] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState({
    work_type: '',
    office: '',
    lat: '',
    lon: '',
    image: imageSrc
  })
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate()

  const checkLocationPermission = () => {
    const ifGrantedFunction = () => {
      setGrant(prev => ({...prev, location: true}))
    }
    checkPermission({name: 'geolocation', permitType: 'lokasi', setShowPopup, ifGrantedFunction})
  }
  const checkWebcamPermission = () => {
    const ifGrantedFunction = () => {
      setGrant(prev => ({...prev, webcam: true}))
    }
    checkPermission({name: 'camera', permitType: 'kamera', setShowPopup, ifGrantedFunction})
  }

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setData(prev => ({...prev, lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Fungsi untuk menghentikan akses webcam
  const stopWebcam = () => {
    if (webcamStream) {
      const tracks = webcamStream.getTracks();
      tracks.forEach((track) => track.stop());
      setWebcamStream(null);
    }
  };

  const getOffices = async () => {
    try {
      const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.OFFICES}`)
      setOffices(response.data?.data)
      setLoading(false)
    } catch(e) {
      console.error(e);
      
    }
  }

  const handleSubmit = async e => {
    setIsSubmitting(true)
    e.preventDefault()
    try {
      await axios.post(`${BASE_URL_API}${API_ENDPOINTS.ABSEN}`, data)
      
      stopWebcam()
      navigate('/')
      setIsHomepage(true)
    } catch(e) {
      setIsSubmitting(false)
      console.log(e.response.data);
      
      handleInPopup({title: 'Alert!', content: e.response.data?.message, setShowPopup})
    }
  }
  const handleCheckLocation = async e => {
    e.preventDefault();
    const formData = {};
    [...e.target].forEach(element => {
      setData(prev => ({
        ...prev,
        [element.name]: element.value
      }))
      formData[element.name] = element.value
    })

    formData['lat'] = data.lat 
    formData['lon'] = data.lon

    try {
      await axios.post(`${BASE_URL_API}${e.target.work_type.value === 'wfo' ? API_ENDPOINTS.CHECKLOCATION : API_ENDPOINTS.CHECKSCHEDULEWFAH}`, formData)
      
      
      setPage(2)
    } catch(e) {
      
      handleInPopup({title: 'Alert!', content: e.response.data?.message, setShowPopup})
    }
  }

  useEffect(() => {
    checkLocationPermission()
    checkWebcamPermission()
    setShowNotificationButton(false)
    getOffices()
  }, [])
  useEffect(() => {
    if(grant?.location) {
      getLocation()
    }
    
  }, [grant])
  useEffect(() => {
    setData(prev => ({
      ...prev,
      image: imageSrc
    }))
  }, [imageSrc])
  return (
    <>
      {loading ? <Loading /> :
        <>
        {children}
        <div className="container mt-5">

          { page === 1 ? <FormAbsen grant={grant} offices={offices} handleCheckLocation={handleCheckLocation} /> : <Webcam isSubmitting={isSubmitting} imageSrc={imageSrc} canvasRef={canvasRef} videoRef={videoRef} setWebcamStream={setWebcamStream} setImageSrc={setImageSrc} webcamStream={webcamStream} handleSubmit={handleSubmit} stopWebcam={stopWebcam} />}
        </div>
        </>
      } 
    </>
  )
}

export default Absen