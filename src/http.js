import VueResource from 'vue-resource'
import Vue from 'vue'
import { Notification } from 'element-ui'

Vue.use(VueResource)

Vue.http.interceptors.push((req, next) => {
  next((res) => {
    if (res.ok) {
      return {
        ok: true,
        data: res.body
      }
    }
    Notification({
      type: 'error',
      title: res.statusText,
      message: (res.body.error || {}).msg || ''
    })
    return res
  })
})
