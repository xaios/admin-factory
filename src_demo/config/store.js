import { defineStore } from 'pinia'

export default defineStore('self', {
  state: () => ({

  }),
  actions: {
    PasswordValidate(data) {
      return new Error('项目示例，不支持密码修改')
    }
  }
})
