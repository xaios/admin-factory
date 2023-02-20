import Axios from 'axios'
import LANG from '@root/tools/language'
import useRootStore from '@root/tools/store'
import { Dialog, Message, Loading } from '@root/tools/operate'

const Request = Axios.create({ timeout: 30000, baseURL: '/api' })

Request.interceptors.response.use(res => {
  res = res.data
  if (res.code === 0) {
    return res.data
  } else if (res.code === 1) {
    Message.error({ content: `${LANG.cgi_error}，${LANG.error_msg}：${res.message || LANG.nothing}`, closable: true })
    Loading.hide()
    return Promise.reject()
  } else if (res.code === 2) {
    Dialog.error({ title: LANG.cgi_error, content: res.message || LANG.no_error })
    Loading.hide()
    return Promise.reject()
  } else if (res.code === 3) {
    useRootStore().UserLogout()
    return Promise.reject()
  }
}, e => {
  if (e.response && e.response.status === 401)
    useRootStore().UserLogout()
  else if (e.response)
    Dialog.error({ title: LANG.network_error, content: `${LANG.state_info}：${e.response.status}` })
  else if (e.toString().includes('timeout'))
    Dialog.error({ title: LANG.network_timeout, content: LANG.try_later })

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
