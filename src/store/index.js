import { createStore } from 'vuex'
import { Get, Post } from '@root/tools/request'
import { default as router, AddRoute, ResetRoute } from '@root/tools/route'

import LANG from './lang.config'

import ENV from '@self/config/config.json'
import STORE_SELF from '@self/config/store'

document.title = ENV.name

const TOKEN = `pomelo_token_${location.origin}`
const USER_NAME = `pomelo_name_${location.origin}`
const USER_ACCOUNT = `pomelo_account_${location.origin}`

export default createStore({
  state: () => ({
    env: ENV,
    lang: LANG,
    keep: [],
    menu: [],
    menu_route: [],
    user_role: '',
    user_name: localStorage[USER_NAME],
    user_account: localStorage[USER_ACCOUNT]
  }),
  modules: {
    self: STORE_SELF
  },
  mutations: {
    SetData(state, data) {
      Object.keys(data).forEach(i => state[i] = data[i])
    }
  },
  actions: {
    SetData(context, data) {
      context.commit('SetData', data)
    },
    PasswordValidate(context, data) {
      if (data.new.length < 6)
        return new Error(data.new ? LANG.password_size : LANG.password_new)
      else if (data.new == data.old)
        return new Error(LANG.password_same)
      else
        return true
    },
    UserLogin(context, data) {
      return new Promise((resolve, reject) => {
        Post('Login/Login', { account: data.username, password: data.password }).then(data => {
          localStorage[TOKEN] = 'true'
          resolve()
        }).catch(reject)
      })
    },
    UserLogout(context) {
      Post('Login/Logout')
      delete localStorage[TOKEN]
      router.replace('/')
      setTimeout(() => context.commit('SetData', { menu: [], menu_route: [] }), 2000)
      ResetRoute(context.state.user_role)
    },
    GetUserInfo(context) {
      return new Promise((resolve, reject) => {
        Get('Login/GetAdminUserInfo').then(data => {
          AddRoute(data.roleName)

          let user_name = `${data.userName}（${data.account}）`
          localStorage[USER_NAME] = user_name
          localStorage[USER_ACCOUNT] = data.account
          context.commit('SetData', { user_name, user_account: data.account, user_role: data.roleName })

          resolve()
        }).catch(reject)
      })
    }
  }
})
