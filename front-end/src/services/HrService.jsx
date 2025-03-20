import axios from "axios"
import { API_ENDPOINTS, BASE_URL_API } from "../config"

class HrService {
  static async getPermitsHr () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.PERMITS}`)
    return response.data?.data
  } 
  static async getEmployees (page = 1, search = '') {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.EMPLOYEES}?page=${page}&search=${search}`)
    return response.data?.data
  } 
  static async getEmployee ({username, range, start_date, end_date, page}) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.EMPLOYEES}${username ? '/' + username : '' }/attendance${range ? '?range=' + range : start_date ? '?start_date=' + start_date : ''}${end_date ? '&end_date=' + end_date : ''}${page ? '&page=' + page : ''}`)
    return response.data?.data
  } 
  static async makeReport (props) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.HR.MAKEREPORT}`, props)
    return response.data?.data
  } 
  static async getAnnouncements () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.ANNOUNCEMENTS}`)
    return response.data?.data
  } 
  static async getAnnouncement(slug) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.ANNOUNCEMENTS}/${slug}`)
    return response.data?.data
  } 
  static async createAnnouncement (data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.HR.ANNOUNCEMENTS}`, data)
    return response.data?.data
  } 
  static async editAnnouncement ({data, slug}) {
    const response = await axios.put(`${BASE_URL_API}${API_ENDPOINTS.HR.ANNOUNCEMENTS}/${slug}`, data)
    return response.data
  } 
  static async deleteAnnouncement (slug) {
    const response = await axios.delete(`${BASE_URL_API}${API_ENDPOINTS.HR.ANNOUNCEMENTS}/${slug}`)
    return response.data
  } 
  static async getAudiences () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.AUDIENCES}`)
    return response.data?.data
  } 

  static async getOffices () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.OFFICES}`)
    return response.data?.data
  } 
  static async getOffice (id) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.OFFICES}/${id}`)
    return response.data?.data
  } 
  static async createOffice(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.HR.OFFICES}`, data)
    return response.data?.data
  } 
  static async editOffice({data, id}) {
    const response = await axios.put(`${BASE_URL_API}${API_ENDPOINTS.HR.OFFICES}/${id}`, data)
    return response.data
  } 
  static async deleteOffice(id) {
    const response = await axios.delete(`${BASE_URL_API}${API_ENDPOINTS.HR.OFFICES}/${id}`)
    return response.data
  }   

  static async getSchedules () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.SCHEDULES}`)
    return response.data?.data
  } 
  static async getSchedule (id) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.SCHEDULES}/${id}`)
    return response.data?.data
  } 
  static async createSchedule(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.HR.SCHEDULES}`, data)
    return response.data?.data
  } 
  static async editSchedule({data, id}) {
    const response = await axios.put(`${BASE_URL_API}${API_ENDPOINTS.HR.SCHEDULES}/${id}`, data)
    return response.data
  } 
  static async deleteSchedule(id) {
    const response = await axios.delete(`${BASE_URL_API}${API_ENDPOINTS.HR.SCHEDULES}/${id}`)
    return response.data
  }   

  static async getWfhSchedules () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.WFHSCHEDULES}`)
    return response.data?.data
  } 
  static async getWfhSchedule (id) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.WFHSCHEDULES}/${id}`)
    return response.data?.data
  } 
  static async createWfhSchedule(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.HR.WFHSCHEDULES}`, data)
    return response.data?.data
  } 
  static async editWfhSchedule({data, id}) {
    const response = await axios.put(`${BASE_URL_API}${API_ENDPOINTS.HR.WFHSCHEDULES}/${id}`, data)
    return response.data
  } 
  static async deleteWfhSchedule(id) {
    const response = await axios.delete(`${BASE_URL_API}${API_ENDPOINTS.HR.WFHSCHEDULES}/${id}`)
    return response.data
  }   
}

export default HrService