import axios from "axios"
import { API_ENDPOINTS, BASE_URL_API } from "../config"

class AdminService 
{
  static async getEmployees(page = 1, search = '') {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ADMIN.EMPLOYEES}?page=${page}&search=${search}`)
    return response.data?.data
  }
  static async getBods() {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ADMIN.BODS}`)
    return response.data?.data
  }
  static async createUser(data) {
    const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.ADMIN.EMPLOYEES}`, data)
    return response.data
  }
  static async editUser(data, id) {
    const response = await axios.put(`${BASE_URL_API}${API_ENDPOINTS.ADMIN.EMPLOYEES}/${id}`, data)
    return response.data
  }
  static async getUser(id) {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ADMIN.EMPLOYEES}/${id}`)
    return response.data?.data
  }
  static async deleteUser(id) {
    const response = await axios.delete(`${BASE_URL_API}${API_ENDPOINTS.ADMIN.EMPLOYEES}/${id}`)
    return response.data
  }
}

export default AdminService