/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { checkPermission } from '@/utils/Permission';
import { Description } from "@/components/User/Addphoto";
import { stopWebcam } from '@/utils/Webcam';
import { Webcam, Container, Loading } from "@/components/";
import UserService from '@/services/UserService';
import { handleInPopup } from "@/utils/Popup";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';

const Addphoto = ({setShowPopup, children}) => {
  const [page, setPage] = useState(1) 
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [granted, setGranted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null)

  const handleSuccessSubmit = () => {
    handleStopWebcam()
    location.replace('/')
  }

  const handleErrorSubmit = (e) => {
    setIsSubmitting(false)
    handleInPopup({setShowPopup, title: 'Peringatan!', content: e.response.data?.message})
  }

  const { execute: submit } = useMultipleFetch({fetchs: [UserService.handleSubmitAddphoto], setLoading, 
    errorCallbackMap: {
      handleSubmitAddphoto: handleErrorSubmit
    }, 
    successCallbackMap: {
      handleSubmitAddphoto: handleSuccessSubmit
  }});

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
    if(!imageSrc) {
      return handleInPopup({title: 'Peringatan!', content: 'Tidak ada gambar!', setShowPopup})
    }
    setIsSubmitting(true)

    submit(imageSrc)
  }

  useEffect(() => {
    checkWebcamPermission()
  }, [])

  if(loading) {
    return <Loading />
  }

  return (
    <Container>
    {children}
    {
      page === 1 ? <Description granted={granted} setPage={setPage} /> : <Webcam imageSrc={imageSrc} canvasRef={canvasRef} videoRef={videoRef} setWebcamStream={setWebcamStream} setImageSrc={setImageSrc} webcamStream={webcamStream} handleSubmit={handleSubmit} isSubmitting={isSubmitting} handleStopWebcam={handleStopWebcam} />
    }
    </Container>
  )
}

export default Addphoto