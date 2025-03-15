/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import UserService from '@/services/UserService';
import { Webcam, Loading, Container } from "@/components";
import { useEffect, useRef, useState } from "react"
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { checkPermission } from '@/utils/Permission';
import { handleInPopup } from '@/utils/Popup';
import { stopWebcam } from '@/utils/Webcam';
import { Form } from "@/components/User/Absen";

const Absen = ({setShowNotificationButton, setShowPopup, children}) => {
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [page, setPage] = useState(1)
  const [grant, setGrant] = useState({location: false, webcam: false});
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    work_type: 'wfo',
    office: '',
    lat: '',
    lon: '',
    image: imageSrc
  })
  const videoRef = useRef(null);
  const canvasRef = useRef(null)
  const [offices, setOffices] = useState([])

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
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
  
  const handleSuccessSubmit = () => {
    handleStopWebcam()
    location.replace('/')
  }
  const handleChangeWorkType = (data, work_type) => [...data].map(dat => dat.work_type === work_type ? dat : null).filter(dat => dat)
  
  const handleErrorSubmit = (e) => {
    setIsSubmitting(false)
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const handleSuccessCheckLocation = () => {
    setPage(2)
  }

  const { data, singleExecute } = useMultipleFetch({fetchs: [UserService.handleSubmitAbsen, UserService.getOffices, UserService.checkLocation], setLoading, 
    errorCallbackMap: {
      getOffices: handleError,
      checkLocation: handleError,
      handleSubmitAbsen: handleErrorSubmit
    }, 
    successCallbackMap: {
      checkLocation: handleSuccessCheckLocation,
      handleSubmitAbsen: handleSuccessSubmit
  }});

  const handleSubmit = async e => {
    e.preventDefault()
    if(!formData || Object.keys(formData).length === 0) {
      return handleInPopup({title: 'Peringatan!', content: 'Tidak ada data yang diberi!', setShowPopup})
    }
    setIsSubmitting(true)
    singleExecute('handleSubmitAbsen', formData)
  }

  const handleCheckLocation = async e => {
    e.preventDefault();
    const tempFormData = {};
    [...e.target].forEach(element => {
      if(element.value && element.name) {
        formData[element.name] = element.name.toLowerCase() === 'office' ? parseInt(element.value) : element.value
      }
    })
  
    tempFormData['lat'] = formData.lat 
    tempFormData['lon'] = formData.lon 

    singleExecute('checkLocation', e, formData)

    for(const key in formData) {
      setFormData(prev => ({
        ...prev,
        [key]: formData[key]
      }))
    }
  }
  const handleStopWebcam = () => {
    stopWebcam({webcamStream, setWebcamStream})
  }
  const fetch_data = async () => {
    checkAllPermission()
    singleExecute('getOffices')
  }
  const isAbsen = async () => {
    const data = await UserService.getAttendance()
    
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
      UserService.getLocation({setShowPopup, callback: setFormData})
    }
  }, [grant])
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      image: imageSrc
    }))
  }, [imageSrc])
  useEffect(() => {
    if(data.getOffices) {
      const office = handleChangeWorkType(data.getOffices, formData.work_type)
      setOffices(office)
      setFormData(prev => ({...prev, office: office.length > 0 ? office[0].id : null}))
    }
  }, [data.getOffices, formData.work_type])

  if(loading) {
    return <Loading />
  }

  return (
    <>
    {children}
    <Container size={'-lg'} marginTop={5}>
      { page === 1 ? <Form formData={formData} handleChange={handleChange} grant={grant} offices={offices} handleCheckLocation={handleCheckLocation} /> : <Webcam isSubmitting={isSubmitting} imageSrc={imageSrc} canvasRef={canvasRef} videoRef={videoRef} setWebcamStream={setWebcamStream} setImageSrc={setImageSrc} webcamStream={webcamStream} handleSubmit={handleSubmit} handleStopWebcam={handleStopWebcam} />}
    </Container>
    </>
  )
}

export default Absen