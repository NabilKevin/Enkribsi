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
  
  static async pulang (data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.PULANG}`, data)
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
  
  static async getPermits (page = 1) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.PERMITS}?page=${page}`)
    return response.data?.data
  }
  static async checkabsent () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.CHECKABSENT}`)
    return response.data
  }
  static async deletePermits (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.PERMITS}/cancel/${id}`)
    return response.data
  }
  
  static async storePermits (data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.PERMITS}`, data)
    return response.data
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
  static async checkLocation (e, data) {
    const response = await axios.post(`${BASE_URL_API}${e.target.work_type.value === 'wfo' ? API_ENDPOINTS.USER.CHECKLOCATION : API_ENDPOINTS.USER.CHECKSCHEDULEWFH}`, data)
    return response.data
  }
  
  static async handleSubmitAddphoto (imageSrc) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.ADDPHOTO}`, {
      'photo': imageSrc
    })
    return response.data
  }
  
  static async handleSubmitAbsen (data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.ABSEN}`, data)
    return response.data
  }
  static async handleLogin (data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.LOGIN}`, data)
    return response.data
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
  static async logout() {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.LOGOUT}`)
    return response.data
  }


  static async submitEmailForgot(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.FORGOTPASSWORD.SUBMITEMAIL}`, data)
    return response
  }
  static async submitTokenForgot(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.FORGOTPASSWORD.SUBMITTOKEN}`, data)
    return response
  }
  static async changePassword(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.USER.FORGOTPASSWORD.CHANGEPASSWORD}`, data)
    return response
  }
  static async checkSubmitEmail() {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.FORGOTPASSWORD.CHECKSUBMITEMAIL}`)
    return response
  }
  static async checkSubmitCode() {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.USER.FORGOTPASSWORD.CHECKSUBMITCODE}`)
    return response
  }
}

export default UserService