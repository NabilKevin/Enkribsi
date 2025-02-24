export const BASE_URL = 'http://localhost:8000'
// export const BASE_URL = 'http://192.168.3.14:8000'
export const BASE_URL_API = `${BASE_URL}/api`
export const API_ENDPOINTS = {
  ME: '/me',
  ABSEN: '/absent',
  ADDPHOTO: '/addphoto',
  PRESENCESCOUNT: '/presences/count',
  PRESENCES: '/presences',
  ATTENDANCE: '/attendance',
  LOGIN: '/auth/login',
  OFFICES: '/offices',
  CHECKLOCATION: '/checklocation',
  CHECKSCHEDULEWFAH: '/checkschedulewfah',
  PULANG: '/leave',
  NOTIFICATIONS: '/notifications',
  DELETENOTIF: '/notifications',
  NOTIFICATIONCOUNT: '/notifications/count'
}