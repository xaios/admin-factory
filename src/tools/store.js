import { defineStore, mapState as mapStatePinia } from 'pinia'
import { Get, Post } from '@root/tools/request'
import { default as router, CreateRoute, RemoveRoute } from '@root/tools/route'

import LANG from '@root/tools/language'
import ENV from '@self/config/config.json'

document.title = ENV.name

const USER_NAME = `pomelo_name_${location.origin}`
const USER_ACCOUNT = `pomelo_account_${location.origin}`

const STORE = defineStore('root', {
  state: () => ({
    env: ENV,
    lang: LANG,
    keep: [],
    menu: [],
    menu_default: '',
    user_role: '',
    user_name: SESSION[USER_NAME],
    user_account: SESSION[USER_ACCOUNT]
  }),
  actions: {
    PasswordValidate(data) {
      if (data.new.length < 6)
        return new Error(data.new ? LANG.password_size : LANG.password_new)
      else if (data.new === data.old)
        return new Error(LANG.password_same)
      else
        return true
    },
    UserLogin(data) {
      return new Promise((resolve, reject) => {
        Post('Login/Login', { account: data.username, password: data.password }).then(data => {
          SESSION[TOKEN] = 'true'
          resolve()
        }).catch(reject)
      })
    },
    UserLogout() {
      Post('Login/Logout')
      delete SESSION[TOKEN]
      router.replace('/')
      setTimeout(() => this.$patch({ menu: [], menu_default: '' }), 2000)
      RemoveRoute(this.user_role)
    },
    InitUser() {
      return new Promise((resolve, reject) => {
        Get('Login/GetAdminUserInfo').then(data => {
          CreateRoute(data.roleName || data.role)

          let user_name = `${data.userName}（${data.account}）`
          SESSION[USER_NAME] = user_name
          SESSION[USER_ACCOUNT] = data.account
          this.$patch({ user_name, user_account: data.account, user_role: data.roleName || data.role })

          resolve()
        }).catch(reject)
      })
    }
  }
})

export default STORE

window.mapState = list => mapStatePinia(STORE, list)
