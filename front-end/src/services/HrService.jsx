import axios from "axios"
import { API_ENDPOINTS, BASE_URL_API } from "../config"

class HrService {
  static async getPermitsHr () {
    const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.HR.PERMITS}`)
    return response.data?.data
  } 
}

export default HrService