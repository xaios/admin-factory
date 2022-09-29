<style scoped lang='stylus' src='./index.styl'></style>

<template>
  <div class='f_center page_login'>
    <img class='background' src='@root/image/login.svg' />
    <n-card class='login' hoverable size='huge' :title='env.name'>
      <n-form label-placement='left' :label-width='0' :model='form_login' :rules='rule_login' ref='form_login'>
        <n-form-item path='username'>
          <n-input size='large' :placeholder='lang.account_input' v-model:value='form_login.username'>
            <template #prefix>
              <n-icon style='margin-right: 5px;' size='20' color='#000' :component='IconUser' />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path='password'>
          <n-input type='password' size='large' show-password-on='click' :placeholder='lang.password_input' v-model:value='form_login.password' @keyup.enter='Login'>
            <template #prefix>
              <n-icon style='margin-right: 5px;' size='20' color='#000' :component='IconLock' />
            </template>
          </n-input>
        </n-form-item>
      </n-form>
      <n-button style='margin-top: 10px;margin-bottom: 20px;' block type='primary' size='large' :loading='loading' @click='Login'>{{lang.login}}</n-button>
    </n-card>
    <div class='p_center copyright'>
      <span>{{env.name}}</span>
      <span v-if='env.tips'> · {{env.tips}}</span>
    </div>
  </div>
</template>

<script>
  import IconLock from '@vicons/tabler/Key'
  import IconUser from '@vicons/tabler/FaceId'

  export default {
    data: () => ({
      IconUser: markRaw(IconUser),
      IconLock: markRaw(IconLock),
      form_login: {
        username: '',
        password: ''
      },
      loading: false
    }),
    computed: {
      ...mapState(['env', 'lang']),
      rule_login() {
        return {
          username: [{ required: true, trigger: ['input', 'blur'], message: this.lang.account_input }],
          password: [{ required: true, trigger: ['input', 'blur'], message: this.lang.password_input }]
        }
      }
    },
    methods: {
      Login() {
        this.form_login.username = this.form_login.username.trim()

        this.$refs.form_login.validate().then(() => {
          if (this.loading) return
          this.loading = true
          this.$store.dispatch('UserLogin', this.form_login).then(data => {
            this.loading = false
            this.$router.replace('/space')
          }).catch(() => this.loading = false)
        })
      }
    }
  }
</script>
