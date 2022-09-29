import Axios from 'axios'
import store from '@root/store'
import { Dialog, Message, Loading } from '@root/tools/operate'

const Request = Axios.create({ timeout: 30000, baseURL: '/api' })

Request.interceptors.response.use(res => {
  res = res.data
  if (res.code == 0) {
    return res.data
  } else if (res.code == 1) {
    Message.error({ content: `${store.state.lang.cgi_error}，${store.state.lang.error_msg}：${res.message || store.state.lang.nothing}`, closable: true })
    Loading.hide()
    return Promise.reject()
  } else if (res.code == 2) {
    Dialog.error({ title: store.state.lang.cgi_error, content: res.message || store.state.lang.no_error })
    Loading.hide()
    return Promise.reject()
  } else if (res.code == 3) {
    store.dispatch('UserLogout')
    return Promise.reject()
  }
}, e => {
  if (e.response && e.response.status == 401)
    store.dispatch('UserLogout')
  else if (e.response)
    Dialog.error({ title: store.state.lang.network_error, content: `${store.state.lang.state_info}：${e.response.status}` })
  else if (e.toString().includes('timeout'))
    Dialog.error({ title: store.state.lang.network_timeout, content: store.state.lang.try_later })

  Loading.hide()
  return Promise.reject()
})

export function Get(cgi, params = {}) {
  return Request.get(cgi, { params })
}

export function Post(cgi, data = {}) {
  let params = data._params || {}
  delete data._params

  return Request.post(cgi, data, { params })
}

export function Upload(file) {
  let data = new FormData
  data.append('file', file)

  return Request.post('/File/FileUpload', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}
