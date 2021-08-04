/*
 * @Description: 
 * @Author: charles
 * @Date: 2020-10-26 17:04:14
 * @LastEditors: charles
 * @LastEditTime: 2021-08-01 13:57:17
 */
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'querystring'
// create an axios instance
const service = axios.create({
  baseURL:'http://121.199.29.84:8001',
  // baseURL:'http://127.0.0.1:8888',
  timeout: 5000 // request timeout
})

// response interceptor
service.interceptors.response.use(
  response => {
    // res就是后端返回来的结果， { status,message,data,timestamp}
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      // 消息弹框
      Message({ message: res.message, type: 'error', duration: 5 * 1000 })
      if (res.status === 401) {
        logout()
      }
      // 返回承诺失败对象
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export function get(url, params) {
  return service.get(url, {
    params, // get 请求时带的参数
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}
export function del(url, params) {
  return service.delete(url, {
    params, // get 请求时带的参数
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

// 自定义post
export function post(url, data) {
  return service.post(url, qs.stringify(data), {
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

// 退出
async function logout() {
  router.push(`/login`)
}

export default service
