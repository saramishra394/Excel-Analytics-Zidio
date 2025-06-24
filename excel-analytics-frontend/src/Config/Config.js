import axios from 'axios'

const createAxiosInstance = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl
  })

  instance.interceptors.request.use((config) => {
    
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    } else {
    
      delete config.headers['Content-Type']
    }
    return config
  })

  return instance
}

const user = createAxiosInstance(import.meta.env.VITE_USERS_BASE_URL)
const chart = createAxiosInstance(import.meta.env.VITE_FILES_BASE_URL)
const admin = createAxiosInstance(import.meta.env.VITE_ADMIN_BASE_URL)
const aiSupport = createAxiosInstance(import.meta.env.VITE_AI_BASE_URL)

export { user, chart, admin, aiSupport}
