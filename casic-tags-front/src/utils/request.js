import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.requestType === 'form') {
      config.headers = { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
      config.data = qs.stringify(config.data, { indices: false })
      // config.url = config.url+"?"+config.data
    } else if (config.requestType === 'json' || !config.requestType) {
      config.headers = { 'content-type': 'application/json;charset=UTF-8' }
    }
    if (getToken()) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    } else if (res.code === 0) {
      return res
    } else if (res.code === 401) {
      Message.error(res.msg)
      store.dispatch('LogOut').then(() => {
        // location.href = '/login';
        router.push('/login')
      })
    } else {
      if (res.msg || res.message) {
        Message({
          message: res.msg || res.message,
          type: 'error'
        })
      }
      // return Promise.reject(res)
    }
    return res
  },
  error => {
    if (error.response) {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
