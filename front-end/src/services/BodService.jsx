import axios from "axios";
import { BASE_URL_API, API_ENDPOINTS } from "@/config";

class BodService {
  static async getPermits (page = 1) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.PERMITS}?page=${page}`)
    return response.data?.data
  }
  static async getPermit (id) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.PERMITS}/${id}`)
    return response.data?.data
  }
  static async denyPermits ({id, data}) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.PERMITS}/deny/${id}`, data)
    return response.data
  }
  static async approvePermits (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.PERMITS}/approve/${id}`)
    return response.data
  }

  static async getAnnouncement (id) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.ANNOUNCEMENTS}/${id}`)
    return response.data?.data
  }
  static async getAnnouncements (page = 1) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.ANNOUNCEMENTS}?page=${page}`)
    return response.data?.data
  }
  static async denyAnnouncements (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.ANNOUNCEMENTS}/deny/${id}`)
    return response.data
  }
  static async approveAnnouncements (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.ANNOUNCEMENTS}/approve/${id}`)
    return response.data
  }

  static async getSchedules (page = 1) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.SCHEDULES}?page=${page}`)
    return response.data?.data
  }
  static async denySchedules (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.SCHEDULES}/deny/${id}`)
    return response.data
  }
  static async approveSchedules (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.SCHEDULES}/approve/${id}`)
    return response.data
  }

  static async getWfhSchedules (page = 1) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.WFHSCHEDULES}?page=${page}`)
    return response.data?.data
  }
  static async denyWfhSchedules (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.WFHSCHEDULES}/deny/${id}`)
    return response.data
  }
  static async approveWfhSchedules (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.WFHSCHEDULES}/approve/${id}`)
    return response.data
  }
  static async getOffices (page = 1) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.OFFICES}?page=${page}`)
    return response.data?.data
  }
  static async denyOffices (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.OFFICES}/deny/${id}`)
    return response.data
  }
  static async approveOffices (id) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.BOD.OFFICES}/approve/${id}`)
    return response.data
  }

  static async getEmployees (page = 1, search = '') {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.EMPLOYEES}?page=${page}&search=${search}`)
    return response.data?.data
  }
  static async getAttendances ({username, range, start_date, end_date, page}) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.BOD.STATISTICS}${username ? '/' + username : '' }${range ? '?range=' + range : start_date ? '?start_date=' + start_date : ''}${end_date ? '&end_date=' + end_date : ''}${page ? '&page=' + page : ''}`)
    return response.data?.data
  }
}

export default BodService

