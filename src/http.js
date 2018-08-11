import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

Vue.http.interceptors.push((req, next) => {
  next((res) => {
    if (res.ok) {
      return {data: res.body, ok: true}
    }
    return res
  })
})
