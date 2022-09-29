<style scoped lang='stylus' src='./index.styl'></style>

<template>
  <n-layout style='height: 100vh;'>
    <n-layout-header inverted class='f_vertically header'>
      <div class='header_logo'>{{env.name}}</div>
      <n-dropdown :options='user_menu' @select='UserMenuTodo'>
        <div class='f_vertically' style='height: 100%;font-size: 14px;'>
          <span style='margin-right: 5px;cursor: default;'>{{user_name}}</span>
          <n-icon :component='IconArrow' />
        </div>
      </n-dropdown>
    </n-layout-header>
    <n-layout has-sider class='sider'>
      <n-layout-sider inverted width='14vw' show-trigger='bar' content-style='padding-right: 10px;' :native-scrollbar='false' :collapsed-width='0' v-if='menu.length'>
        <n-menu inverted :options='menu' :render-label='RenderMenuLabel' v-model:expanded-keys='menu_opened' :value='menu_active' @update:value='ChangeMenu' />
      </n-layout-sider>
      <n-layout-content class='content'>
        <n-tabs closable style='height: 40px;' type='card' v-model:value='page' @close='RemoveTab' @update:value='ChooseTab' v-if='menu.length'>
          <n-tab :name='n.path' v-for='n in tabs'>{{n.text}}</n-tab>
        </n-tabs>
        <n-scrollbar style='height: calc(100vh - 100px);' ref='scroll'>
          <div :class='{ page_with_container: menu.length }'>
            <router-view #default='{ Component }'>
              <transition name='fade' mode='out-in'>
                <keep-alive :include='keep_alive'>
                  <component :is='Component' />
                </keep-alive>
              </transition>
            </router-view>
          </div>
          <n-back-top />
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
    <n-drawer v-model:show='show_config' :width='400'>
      <n-drawer-content closable :title='lang.password_change'>
        <n-form require-mark-placement='left' label-placement='left' :label-width='0' :model='form_config' :rules='rule_config' ref='form_config'>
          <n-form-item path='password_0'>
            <n-input type='password' size='large' show-password-on='click' :placeholder='lang.password_old' v-model:value='form_config.password_0'>
              <template #prefix>
                <n-icon color='#000' :component='IconPassword' />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path='password_1'>
            <n-input type='password' size='large' show-password-on='click' :placeholder='lang.password_new' v-model:value='form_config.password_1'>
              <template #prefix>
                <n-icon color='#000' :component='IconPassword' />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path='password_2'>
            <n-input type='password' size='large' show-password-on='click' :placeholder='lang.password_new_again' v-model:value='form_config.password_2'>
              <template #prefix>
                <n-icon color='#000' :component='IconPassword' />
              </template>
            </n-input>
          </n-form-item>
        </n-form>
        <div class='g-modal-footer'>
          <n-button type='primary' :loading='loading' @click='SubmitPassword'>{{lang.submit}}</n-button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </n-layout>
</template>

<script>
  import { RouterLink } from 'vue-router'

  import Emitter from '@root/tools/operate'

  import { NIcon } from 'naive-ui'
  import IconPassword from '@vicons/tabler/Key'
  import IconLogout from '@vicons/tabler/Logout'
  import IconOpen from '@vicons/tabler/ExternalLink'
  import IconArrow from '@vicons/tabler/ChevronDown'

  export default {
    data: () => ({
      IconArrow: markRaw(IconArrow),
      IconPassword: markRaw(IconPassword),
      menu_opened: [],
      menu_active: '',
      page: '',
      tabs: [],
      form_config: {
        password_0: '',
        password_1: '',
        password_2: ''
      },
      show_config: false,
      loading: false
    }),
    computed: {
      ...mapState(['env', 'user_name', 'menu', 'keep', 'lang', 'menu_route']),
      keep_alive() {
        return this.tabs.map(i => i.name).filter(i => this.keep.has(i))
      },
      user_menu() {
        return [{
          icon: () => h(NIcon, { component: IconPassword }),
          label: this.lang.password_change,
          key: 'ShowPassword'
        }, {
          icon: () => h(NIcon, { component: IconLogout }),
          label: this.lang.logout,
          key: 'UserLogout'
        }]
      },
      rule_config() {
        return {
          password_0: [{ required: true, trigger: ['input', 'blur'], message: this.lang.password_old }],
          password_1: [{
            required: true,
            trigger: ['input', 'blur'],
            validator: (rule, value) => {
              return new Promise(async (resolve, reject) => {
                let data = { old: this.form_config.password_0, new: value }
                let result = this.$store.dispatch('self/PasswordValidate', data)

                if (result instanceof Promise)
                  result = await result

                if (result === false)
                  result = await this.$store.dispatch('PasswordValidate', data)

                result instanceof Error ? reject(result) : resolve(result)
              })
            }
          }],
          password_2: [{
            required: true,
            trigger: ['input', 'blur'],
            validator: (rule, value) => {
              if (value != this.form_config.password_1)
                return new Error(this.lang.password_diff)
              else
                return true
            }
          }]
        }
      }
    },
    watch: {
      $route: {
        immediate: true,
        handler(val) {
          this.UpdateRoute(val)
        }
      }
    },
    methods: {
      RenderMenuLabel(option) {
        if (option.link)
          return h('div', { class: 'f_vertically' }, [
            h('span', { style: { marginRight: '5px' } }, option.text),
            h(NIcon, { size: 14 }, { default: () => h(IconOpen) })
          ])
        else if (option.path && !option.children)
          return h(RouterLink, { to: option.path }, { default: () => option.text })
        else
          return option.text
      },
      ChangeMenu(name, item) {
        if (item.link)
          open(item.link)
        else
          this.menu_active = name
      },
      UserMenuTodo(name) {
        this[name]()
      },
      ShowPassword() {
        this.form_config = {
          password_0: '',
          password_1: '',
          password_2: ''
        }
        this.show_config = true
      },
      SubmitPassword() {
        this.$refs.form_config.validate().then(() => {
          this.loading = true
          this.$post('Login/UpdatePassword', { oldPassword: this.form_config.password_0, newPassword: this.form_config.password_1 }).then(data => {
            this.loading = false
            this.show_config = false
            this.$message.success(this.lang.change_success)
          }).catch(() => this.loading = false)
        })
      },
      UserLogout() {
        this.$dialog.confirm({ content: this.lang.sure_logout }).then(() => this.$store.dispatch('UserLogout'))
      },
      ChooseTab(path) {
        this.$route.fullPath != path && this.$router.replace(path)
      },
      RemoveTab(name) {
        let index = this.tabs.findIndex(i => i.path == name)
        this.tabs.splice(index, 1)

        this.is_removed = true
        this.page == name && this.ChooseTab(!this.tabs.length ? '/space' : this.tabs[index == 0 ? 0 : index - 1].path)
      },
      FocusMenu(name) {
        let menu = this.menu.find(i => i.key == name)
        if (menu) {
          if (menu.children && !this.menu_opened.includes(menu.key))
            this.menu_opened.push(menu.key)

          return menu.children ? menu.children[0].key : name
        }

        menu = this.menu.find(i => i.children && i.children.some(i => i.key == name))
        if (!menu) return ''

        if (!this.menu_opened.includes(menu.key))
          this.menu_opened.push(menu.key)

        return name
      },
      UpdateRoute(page) {
        this.menu_active = this.FocusMenu(page.meta.name)
        this.page = page.fullPath

        if (page.meta.name) {
          let item = this.tabs.find(i => i.name == page.meta.name)
          if (item)
            item.path = page.fullPath
          else
            this.tabs.push({ name: page.meta.name, text: page.meta.text, path: page.fullPath })
        } else if (page.name == 'space' && this.tabs.length) {
          this.ChooseTab(this.tabs[0].path)
        } else if (page.name == 'space' && !this.is_removed) {
          this.ChooseTab(this.menu.length ? this.menu[0].path : this.menu_route[0].path)
        }

        this.BackTop()
        this.is_removed = false
      },
      BackTop() {
        this.$refs.scroll?.scrollTo({ top: 0 })
      }
    },
    created() {
      Emitter.on('backtop', this.BackTop)
    }
  }
</script>
