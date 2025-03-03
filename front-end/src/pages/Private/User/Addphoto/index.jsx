/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { checkPermission } from '@/utils/Permission';
import { Description } from "@/components/User/Addphoto";
import { stopWebcam } from '@/utils/Webcam';
import { Webcam } from "@/components/";
import UserService from '@/services/UserService';

const Addphoto = ({checkAuth, setLoading, setShowPopup, children}) => {
  const [page, setPage] = useState(1) 
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [granted, setGranted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null)

  const checkWebcamPermission = async () => {
    const callback = () => {
      setGranted(true)
    }
    await checkPermission({name: 'camera', permitType: 'kamera', setShowPopup, callback})
  }

  const handleStopWebcam = () => {
    stopWebcam({webcamStream, setWebcamStream})
  };

  const handleSubmit = async () => {
    await UserService.handleSubmitAddphoto({setIsSubmitting, setShowPopup, imageSrc, callback: () => {
      handleStopWebcam()
      checkAuth()
      location.replace('/')
    }})
  }

  useEffect(() => {
    setLoading(false)
    checkWebcamPermission()
  }, [])

  return (
    <>
    {children}
    {
      page === 1 ? <Description granted={granted} setPage={setPage} /> : <Webcam imageSrc={imageSrc} canvasRef={canvasRef} videoRef={videoRef} setWebcamStream={setWebcamStream} setImageSrc={setImageSrc} webcamStream={webcamStream} handleSubmit={handleSubmit} isSubmitting={isSubmitting} handleStopWebcam={handleStopWebcam} />
    }
    </>
  )
}

export default Addphoto