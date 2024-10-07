import axios from 'axios'
const local = process.env.SERVER_URL
const deployApi = 'https://spiffy-fortune-porcupine.glitch.me/api' 

const api = axios.create({
    baseURL: deployApi
})
export default api