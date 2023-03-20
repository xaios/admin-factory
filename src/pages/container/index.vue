<template>
  <n-config-provider abstract inline-theme-disabled :locale='zhCN' :date-locale='dateZhCN' :theme-overrides='theme'>
    <n-dialog-provider>
      <n-message-provider keep-alive-on-hover>
        <n-notification-provider keep-alive-on-hover>
          <n-layout>
            <container-content />
          </n-layout>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
    <n-dropdown trigger='manual' placement='bottom-start' :x='menu_x' :y='menu_y' :options='menu_list' :show='show_menu' @contextmenu.prevent @select='MenuTodo' @clickoutside='HideMenu' />
    <n-modal :z-index='9999' :show='show_spin'>
      <div style='box-shadow: none;'>
        <n-spin>
          <template #description>
            <span style='color: #f2f2f2;font-size: 14px;'>{{spin_desc}}</span>
          </template>
        </n-spin>
      </div>
    </n-modal>
    <n-modal preset='card' :title='lang.cropper' :style="{ width: '800px' }" v-model:show='show_cropper' @update:show='HideCropper()'>
      <vue-cropper style='height: 46vh;' auto-crop center-box :info='false' :fixed='cropper_fixed' :fixed-number='cropper_radio' :img='cropper_img' ref='cropper' />
      <div class='g-modal-footer'>
        <n-button @click='HideCropper()'>{{lang.cancel}}</n-button>
        <n-button type='primary' @click='SubmitCropper'>{{lang.confirm}}</n-button>
      </div>
    </n-modal>
  </n-config-provider>
</template>

<script>
  import { zhCN, dateZhCN } from 'naive-ui'
  import theme from '@root/style/theme.json'

  import Emitter from '@root/tools/operate'

  import ContainerContent from './content.vue'

  export default {
    data: () => ({
      theme,
      zhCN,
      dateZhCN,
      spin_desc: '',
      show_spin: false,
      menu_x: 0,
      menu_y: 0,
      menu_list: [],
      show_menu: false,
      cropper_img: '',
      cropper_fixed: true,
      cropper_radio: [1, 1],
      show_cropper: false
    }),
    computed: mapState(['lang']),
    methods: {
      MenuTodo(_, option) {
        this.HideMenu()
        this.MenuResult(option)
      },
      HideMenu() {
        if (this.hide_menu_able)
          this.show_menu = false
      },
      HideCropper(result) {
        this.CropResult(result)
        this.show_cropper = false
      },
      SubmitCropper() {
        this.$refs.cropper.getCropBlob(blob => this.HideCropper(new File([blob], 'temp.jpg', { type: 'image/jpeg' })))
      }
    },
    components: { ContainerContent },
    created() {
      Emitter.on('spin', ([show, desc]) => {
        this.spin_desc = desc
        this.show_spin = show
      })

      Emitter.on('menu', ([e, option, next]) => {
        e.preventDefault()
        this.menu_x = e.clientX
        this.menu_y = e.clientY
        this.menu_list = option
        this.show_menu = true
        this.hide_menu_able = false
        setTimeout(() => this.hide_menu_able = true, 300)
        this.MenuResult = next
      })

      Emitter.on('crop', ([image, size, next]) => {
        this.$spin.show()
        this.cropper_fixed = Array.isArray(size)
        this.cropper_radio = Array.isArray(size) ? size : [1, 1]

        const reader = new FileReader
        reader.onload = () => {
          this.cropper_img = reader.result
          this.show_cropper = true
          this.$spin.hide()
        }
        reader.readAsDataURL(image)

        this.CropResult = next
      })
    }
  }
</script>
