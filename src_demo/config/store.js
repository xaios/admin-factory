export default {
  namespaced: true,
  state: () => ({

  }),
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
      return false
    }
  }
}
