/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { BASE_URL_API } from "@/config";
import { useNavigate } from "react-router-dom";
import { Webcam, DescriptionAddphoto } from "@/components/";
import { API_ENDPOINTS } from "@/config";
import { checkPermission } from '@/utils/Permission';
import { handleInPopup } from '@/utils/Popup';

const Addphoto = ({checkAuth, setLoading, setShowPopup, children}) => {
  const [page, setPage] = useState(1) 
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [grant, setGrant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate()

  const checkWebcamPermission = () => {
    const ifGrantedFunction = () => {
      setGrant(true)
    }
    checkPermission({name: 'camera', permitType: 'kamera', setShowPopup, ifGrantedFunction})
  }

  // Fungsi untuk menghentikan akses webcam
  const stopWebcam = () => {
    if (webcamStream) {
      const tracks = webcamStream.getTracks();
      tracks.forEach((track) => track.stop());
      setWebcamStream(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await axios.post(`${BASE_URL_API}${API_ENDPOINTS.ADDPHOTO}`, {
        'photo': imageSrc
      })
      
      stopWebcam()
      checkAuth()
      navigate('/')
    } catch(e) {
      setIsSubmitting(false)
      handleInPopup({setShowPopup, title: 'Alert!', message: e.response.data?.message})
    }
  }

  useEffect(() => {
    setLoading(false)
    checkWebcamPermission()
  }, [])
  return (
    <>
    {children}
    {
      page === 1 ? <DescriptionAddphoto grant={grant} setPage={setPage} /> : <Webcam imageSrc={imageSrc} canvasRef={canvasRef} videoRef={videoRef} setWebcamStream={setWebcamStream} setImageSrc={setImageSrc} webcamStream={webcamStream} handleSubmit={handleSubmit} isSubmitting={isSubmitting} stopWebcam={stopWebcam} />
    }
    </>
  )
}

export default Addphoto