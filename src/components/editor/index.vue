<style scoped lang='stylus' src='./index.styl'></style>

<template>
  <div class='editor'>
    <e-tool class='editor_tool' mode='simple' :default-config='config_tool' :editor='editor' />
    <e-core class='editor_core' style='height: 350px;' :default-config='config_core' @on-created='Init' @on-change='Change' />
  </div>
</template>

<script>
  import '@wangeditor/editor/dist/css/style.css'

  import { shallowRef } from 'vue'
  import { useObjectUrl } from '@vueuse/core'
  import { Toolbar as ETool, Editor as ECore } from '@wangeditor/editor-for-vue'

  export default {
    props: {
      value: String,
      placeholder: String
    },
    emits: ['update:value', 'upload'],
    data: () => ({
      editor: null,
      config_tool: {
        toolbarKeys: [
          'blockquote', 'header1', 'header2', 'bold', 'underline', 'through', 'color', 'bulletedList',
          'numberedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertLink', 'uploadImage', 'fullScreen'
        ]
      }
    }),
    computed: {
      config_core() {
        return {
          placeholder: this.placeholder,
          MENU_CONF: {
            uploadImage: { customBrowseAndUpload: this.ChooseImage }
          },
          hoverbarKeys: {
            image: { menuKeys: ['imageWidth30', 'imageWidth50', 'imageWidth100', 'deleteImage'] }
          }
        }
      }
    },
    watch: {
      value(value) {
        this.editor.getHtml() !== value && this.editor.setHtml(value)
      }
    },
    methods: {
      Init(editor) {
        editor.setHtml(this.value)
        this.editor = Object.seal(editor)
      },
      Change(editor) {
        let value = editor.getHtml()
        this.$emit('update:value', value === '<p><br></p>' ? '' : value)
      },
      ChooseImage(handle) {
        this.$photo().then(file => {
          if (!file) return
          let src = useObjectUrl(shallowRef(file)).value
          this.image_map[src] = file
          handle(src)
        })
      },
      Upload() {
        let content = this.editor.getHtml()

        let images = content.match(/<img.*?(?:>|\/>)/gi)
        if (!images) return this.$emit('upload')

        let Load = this.$preload(images.length, () => {
          this.$emit('update:value', content)
          this.$emit('upload')
        })

        images.forEach(i => {
          let src = i.match(/src=[\'\"]?(blob:http[^\'\"]*)[\'\"]?/i)
          if (!src) return Load()

          this.$upload(this.image_map[src[1]]).then(data => {
            content = content.replace(src[1], data)
            Load()
          })
        })
      }
    },
    components: { ETool, ECore },
    mounted() {
      this.image_map = {}
    },
    unmounted() {
      this.editor.destroy()
    }
  }
</script>
