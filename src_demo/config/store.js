import { defineStore } from 'pinia'

export default defineStore('self', {
  state: () => ({

  }),
  actions: {
    PasswordValidate(data) {
      return new Error('示例项目不支持修改密码')
    }
  }
})
