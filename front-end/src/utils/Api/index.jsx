import axios from "axios";
import { API_ENDPOINTS, BASE_URL_API } from "@/config";
import { handleInPopup } from "@/utils/Popup";

export const getPresences = async ({setShowPopup}) => {
  let data = null;
  try {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.PRESENCES}`)
    data = response.data?.data
  } catch(e) {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  return data
}

export const getAttendance = async ({setShowPopup}) => {
    let data = null;
  try {
      const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ATTENDANCE}`)
      data = response.data?.data
      
  } catch(e) {
      
      if(e.status === 404) {
          handleInPopup({title: 'Pengingat!', content: 'Kamu belum absen hari ini!', setShowPopup})
      } 
  }
  return data
}

export const pulang = async ({setShowPopup}) => {
    let data = null
    try {
        const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.PULANG}`)
        data = response.data?.data
        handleInPopup({title: 'Sukses!', content: response.data?.message, setShowPopup})
    } catch(e) {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
    return data
}

export const getOffices = async ({setShowPopup}) => {
    let data = null
    try {
      const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.OFFICES}`)
      data = response.data?.data
    } catch(e) {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
    return data
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

export const getNotifications = async ({setShowPopup}) => {
  let data = null;
  try {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.NOTIFICATIONS}`)
    data = response.data?.data
  } catch(e) {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  return data
}

export const deleteNotification = async ({slugs, setShowPopup, callback}) => {
  try {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.DELETENOTIF}`, {slugs})
    handleInPopup({title: 'Sukses!', content: response.data?.message, setShowPopup})
    callback()
  } catch(e) {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
}

export const getNotification = async ({setShowPopup, slug}) => {
  let data = null;
  try {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.NOTIFICATIONS}/${slug}`)
    data = response.data?.data
  } catch(e) {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  return data
}
export const getNotificationCount = async ({setShowPopup}) => {
  let data = null;
  try {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.NOTIFICATIONCOUNT}`)
    data = response.data?.data
  } catch(e) {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  return data
}