import axios from 'axios'

const API = axios.create({
    baseURL: "http://192.168.31.193:3000/api/user",
    
})

export default API