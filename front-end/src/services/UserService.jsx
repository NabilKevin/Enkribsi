import axios from "axios";
import { API_ENDPOINTS, BASE_URL_API } from "@/config";
import { handleInPopup } from "@/utils/Popup";

class UserService
{

  static async getPresencesCount () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.PRESENCESCOUNT}`)
    return response.data?.data
  }
  static async getPresences () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.PRESENCES}`)
    return response.data?.data
  }
  
  static async getAttendance () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.ATTENDANCE}`)
    return response.data?.data
  }
  
  static async pulang () {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.PULANG}`)
    return response.data
  }
  
  static async getNotifications () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.NOTIFICATIONS}`)
    return response.data?.data
  }
  
  static async getOffices () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.OFFICES}`)
    return response.data?.data
  }
  
  static async getNotification (slug) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.NOTIFICATIONS}/${slug}`)
    return response.data?.data
  }
  
  static async deleteNotifications (slugs) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.DELETENOTIF}`, {slugs})
    return response.data
  }
  
  static async getNotificationsCount () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.NOTIFICATIONCOUNT}`)
    return response.data?.data
  }
  static async getAuth () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.ME}`)
    return response.data?.user
  }
  static getLocation({setShowPopup, callback}) {
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
  
  static async checkLocation ({e, ifSuccess, data, setShowPopup}) {
    e.preventDefault();
    const formData = {};
    [...e.target].forEach(element => {
      formData[element.name] = element.value
    })
  
    formData['lat'] = data.lat 
    formData['lon'] = data.lon
  
    try {
      await axios.post(`${BASE_URL_API}${e.target.work_type.value === 'wfo' ? API_ENDPOINTS.USER.CHECKLOCATION : API_ENDPOINTS.USER.CHECKSCHEDULEWFAH}`, formData)
      ifSuccess()
    } catch(e) {
      
      handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
  
    return formData
  }
  
  static async handleSubmitAddphoto ({setIsSubmitting, callback, setShowPopup, imageSrc}) {
    setIsSubmitting(true)
    if(!imageSrc) {
      setIsSubmitting(false)
      return handleInPopup({title: 'Peringatan!', content: 'Tidak ada gambar!', setShowPopup})
    }
    try {
      await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.ADDPHOTO}`, {
        'photo': imageSrc
      })
      
      callback()
    } catch(e) {
      setIsSubmitting(false)
      handleInPopup({setShowPopup, title: 'Peringatan!', content: e.response.data?.message})
    }
  }
  
  static async handleSubmitAbsen ({e, setIsSubmitting, setShowPopup, callback, data}) {
    setIsSubmitting(true)
    e.preventDefault()
    if(!data || Object.keys(data).length === 0) {
      setIsSubmitting(false)
      return handleInPopup({title: 'Peringatan!', content: 'Tidak ada data yang diberi!', setShowPopup})
    }
    try {
      await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.ABSEN}`, data)
      callback()
    } catch(e) {
      setIsSubmitting(false)
      handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
  }
  static async handleLogin (data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.LOGIN}`, data)
    return response.data
  }
}

export default UserService