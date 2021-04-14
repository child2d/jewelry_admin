import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.ServerNo !== 200) {
      // 400手动抛错
      if (res.ServerNo === 400) {
        Message({
          message: res.ResultData,
          type: 'warning',
          duration: 5 * 1000
        })
      } else {
        // 500和API
        // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'error'
        // }).then(() => {
        //   store.dispatch('user/FedLogOut').then(() => {
        //     location.reload()
        //   })
        // })
      }
      // 抛出报错信息
      return Promise.reject(res)
    } else {
      return res.ResultData
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

export default service
