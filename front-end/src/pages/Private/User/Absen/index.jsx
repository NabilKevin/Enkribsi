/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { Webcam, FormAbsen } from "@/components";
import { handleInPopup } from '@/utils/Popup';
import { checkPermission } from '@/utils/Permission';
import { getOffices, getLocation, checkLocation, handleSubmitAbsen, getAttendance } from '@/utils/Api';
import { stopWebcam } from '@/utils/Webcam';
import { Loading, Container } from "@/components";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';

const Absen = ({setShowNotificationButton, setShowPopup, children}) => {
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [page, setPage] = useState(1)
  const [grant, setGrant] = useState({location: false, webcam: false});
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState({
    work_type: '',
    office: '',
    lat: '',
    lon: '',
    image: imageSrc
  })
  const videoRef = useRef(null);
  const canvasRef = useRef(null)

  const checkLocationPermission = async () => {
    const callback = () => {
      setGrant(prev => ({...prev, location: true}))
    }
    await checkPermission({name: 'geolocation', permitType: 'lokasi', setShowPopup, callback})
  }
  const checkWebcamPermission = async () => {
    const callback = () => {
      setGrant(prev => ({...prev, webcam: true}))
    }
    await checkPermission({name: 'camera', permitType: 'kamera', setShowPopup, callback})
  }

  const checkAllPermission = async () => {
    await checkLocationPermission()
    await checkWebcamPermission()
  }

  const handleSubmit = async e => {
    await handleSubmitAbsen({e, setIsSubmitting, setShowPopup, data, callback: () => {
      handleStopWebcam()
      location.replace('/')
    }})
  }

  const handleCheckLocation = async e => {
    const obj = await checkLocation({
      ifSuccess: () => setPage(2),
      e, data, setShowPopup
    })

    for(const key in obj) {
      setData(prev => ({
        ...prev,
        [key]: obj[key]
      }))
    }
  }

  const handleStopWebcam = () => {
    stopWebcam({webcamStream, setWebcamStream})
  }

  const handleErrorOffices = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const { data: offices, execute: setOffices } = useMultipleFetch({fetchs: [getOffices], setLoading, 
    errorCallbackMap: {
        getOffices: handleErrorOffices,
    }
  });

  const fetch_data = async () => {
    checkAllPermission()
    setOffices()
  }

  const isAbsen = async () => {
    const data = await getAttendance()
    
    if(data) {
      location.replace('/')
    }
  }

  useEffect(() => {
    isAbsen()
    fetch_data()
    setShowNotificationButton(false)
  }, [])
  useEffect(() => {
    if(grant?.location) {
      getLocation({setShowPopup, callback: setData})
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
        <Container size={'-lg'} marginTop={5}>
          { page === 1 ? <FormAbsen grant={grant} offices={offices?.getOffices} handleCheckLocation={handleCheckLocation} /> : <Webcam isSubmitting={isSubmitting} imageSrc={imageSrc} canvasRef={canvasRef} videoRef={videoRef} setWebcamStream={setWebcamStream} setImageSrc={setImageSrc} webcamStream={webcamStream} handleSubmit={handleSubmit} handleStopWebcam={handleStopWebcam} />}
        </Container>
        </>
      } 
    </>
  )
}

export default Absen