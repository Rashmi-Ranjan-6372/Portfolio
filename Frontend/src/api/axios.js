
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})

const refreshApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access')

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('accounts/login/') &&
            !originalRequest.url?.includes('accounts/token/refresh/')
        ) {
            const refreshToken = localStorage.getItem('refresh')

            if (!refreshToken) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.location.href = '/admin/login'

                return Promise.reject(error)
            }

            originalRequest._retry = true

            try {
                const response = await refreshApi.post(
                    'accounts/token/refresh/',
                    { refresh: refreshToken }
                )

                const newAccessToken = response.data.access

                localStorage.setItem('access', newAccessToken)

                originalRequest.headers =
                    originalRequest.headers || {}

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`

                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.location.href = '/admin/login'

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
