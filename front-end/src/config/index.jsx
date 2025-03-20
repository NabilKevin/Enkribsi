// export const BASE_URL = 'http://localhost:8000'
export const BASE_URL = 'http://192.168.3.8:8000'
// export const BASE_URL = 'http://192.168.100.205:8000'
export const BASE_URL_API = `${BASE_URL}/api`
export const API_ENDPOINTS = {
  USER: {
    ME: '/me',
    ABSEN: '/absent',
    ADDPHOTO: '/addphoto',
    PRESENCESCOUNT: '/presences/count',
    PRESENCES: '/presences',
    ATTENDANCE: '/attendance',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    OFFICES: '/offices',
    CHECKLOCATION: '/checklocation',
    CHECKSCHEDULEWFH: '/checkschedulewfh',
    PULANG: '/leave',
    NOTIFICATIONS: '/notifications',
    DELETENOTIF: '/notifications',
    NOTIFICATIONCOUNT: '/notifications/count'
  },
  HR: {
    PERMITS: '/hr/permits/today',
    EMPLOYEES: '/hr/employees',
    MAKEREPORT: '/hr/report',
    ANNOUNCEMENTS: '/hr/announcements',
    OFFICES: '/hr/offices',
    SCHEDULES: '/hr/schedules',
    WFHSCHEDULES: '/hr/wfh/schedules',
    AUDIENCES: '/hr/audiences',
  }
}