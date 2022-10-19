import { Get, Post } from '@root/tools/request'
import { defineStore, mapState as mapStatePinia } from 'pinia'
import { default as router, AddRoute, ResetRoute } from '@root/tools/route'

import LANG from '@root/tools/language'
import ENV from '@self/config/config.json'

document.title = ENV.name

const TOKEN = `pomelo_token_${location.origin}`
const USER_NAME = `pomelo_name_${location.origin}`
const USER_ACCOUNT = `pomelo_account_${location.origin}`

const STORE = defineStore('root', {
  state: () => ({
    env: ENV,
    lang: LANG,
    keep: [],
    menu: [],
    menu_route: [],
    user_role: '',
    user_name: localStorage[USER_NAME],
    user_account: localStorage[USER_ACCOUNT],
    sider_width: ENV.sider_width || '14vw'
  }),
  actions: {
    PasswordValidate(data) {
      if (data.new.length < 6)
        return new Error(data.new ? LANG.password_size : LANG.password_new)
      else if (data.new == data.old)
        return new Error(LANG.password_same)
      else
        return true
    },
    UserLogin(data) {
      return new Promise((resolve, reject) => {
        Post('Login/Login', { account: data.username, password: data.password }).then(data => {
          localStorage[TOKEN] = 'true'
          resolve()
        }).catch(reject)
      })
    },
    UserLogout() {
      Post('Login/Logout')
      delete localStorage[TOKEN]
      router.replace('/')
      setTimeout(() => this.$patch({ menu: [], menu_route: [] }), 2000)
      ResetRoute(this.user_role)
    },
    GetUserInfo() {
      return new Promise((resolve, reject) => {
        Get('Login/GetAdminUserInfo').then(data => {
          AddRoute(data.roleName || data.role)

          let user_name = `${data.userName}（${data.account}）`
          localStorage[USER_NAME] = user_name
          localStorage[USER_ACCOUNT] = data.account
          this.$patch({ user_name, user_account: data.account, user_role: data.roleName || data.role })

          resolve()
        }).catch(reject)
      })
    }
  }
})

export default STORE

export function mapState(list) {
  return mapStatePinia(STORE, list)
}
