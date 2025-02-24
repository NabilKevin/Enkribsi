import axios from "axios";
import { API_ENDPOINTS, BASE_URL_API } from "@/config";
import { handleInPopup } from "@/utils/Popup";

export const getPresencesCount = async () => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.PRESENCESCOUNT}`)
  return response.data?.data
}
export const getPresences = async () => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.PRESENCES}`)
  return response.data?.data
}

export const getAttendance = async () => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ATTENDANCE}`)
  return response.data?.data
}

export const pulang = async () => {
  const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.PULANG}`)
  return response.data
}

export const getNotifications = async () => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.NOTIFICATIONS}`)
  return response.data?.data
}

export const getOffices = async () => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.OFFICES}`)
  return response.data?.data
}

export const getNotification = async (slug) => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.NOTIFICATIONS}/${slug}`)
  return response.data?.data
}

export const deleteNotifications = async (slugs) => {
  const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.DELETENOTIF}`, {slugs})
  return response.data
}

export const getNotificationsCount = async () => {
  const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.NOTIFICATIONCOUNT}`)
  return response.data?.data
}

export const getLocation = ({setShowPopup, callback}) => {
  if ("geolocation" in navigator) {
    try{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          callback(prev => ({
            ...prev,
            lat: latitude,
            lon: longitude
          }))
        },
        (e) => {
          console.error(e);
          
          handleInPopup({title: 'Peringatan!', content: e.message, setShowPopup})
        }
      );
    } catch(e) {
      console.error(e);
    }
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

export const checkLocation = async ({e, ifSuccess, data, setShowPopup}) => {
  e.preventDefault();
  const formData = {};
  [...e.target].forEach(element => {
    formData[element.name] = element.value
  })

  formData['lat'] = data.lat 
  formData['lon'] = data.lon

  try {
    await axios.post(`${BASE_URL_API}${e.target.work_type.value === 'wfo' ? API_ENDPOINTS.CHECKLOCATION : API_ENDPOINTS.CHECKSCHEDULEWFAH}`, formData)
    ifSuccess()
  } catch(e) {
    
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  return formData
}

export const handleSubmitAddphoto = async ({setIsSubmitting, callback, setShowPopup, imageSrc}) => {
  setIsSubmitting(true)
  if(!imageSrc) {
    setIsSubmitting(false)
    return handleInPopup({title: 'Peringatan!', content: 'Tidak ada gambar!', setShowPopup})
  }
  try {
    await axios.post(`${BASE_URL_API}${API_ENDPOINTS.ADDPHOTO}`, {
      'photo': imageSrc
    })
    
    callback()
  } catch(e) {
    setIsSubmitting(false)
    handleInPopup({setShowPopup, title: 'Peringatan!', content: e.response.data?.message})
  }
}

export const handleSubmitAbsen = async ({e, setIsSubmitting, setShowPopup, callback, data}) => {
  setIsSubmitting(true)
  e.preventDefault()
  if(!data || Object.keys(data).length === 0) {
    setIsSubmitting(false)
    return handleInPopup({title: 'Peringatan!', content: 'Tidak ada data yang diberi!', setShowPopup})
  }
  try {
    await axios.post(`${BASE_URL_API}${API_ENDPOINTS.ABSEN}`, data)
    callback()
  } catch(e) {
    setIsSubmitting(false)
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
}