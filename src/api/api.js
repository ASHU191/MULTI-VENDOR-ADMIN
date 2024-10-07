import axios from 'axios'
const backendUrl = process.env.SERVER_URL

const api = axios.create({
    baseURL: `/api`
})
export default api