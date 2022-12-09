<style scoped lang='stylus' src='./index.styl'></style>

<style lang='stylus'>
  .n-form-item-blank--error .editor .editor_content
    border-color #d03050
</style>

<template>
  <div class='editor' :class='{ is_full: is_full }'>
    <div class='editor_content' ref='container'>
      <n-space class='toolbar' ref='toolbar' v-if='editor'>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleBold().run()'>{{lang.editor_bold}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleItalic().run()'>{{lang.editor_italic}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleUnderline().run()'>{{lang.editor_underline}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleHeading({ level: 1 }).run()'>{{lang.editor_heading_1}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleHeading({ level: 2 }).run()'>{{lang.editor_heading_2}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleBulletList().run()'>{{lang.editor_bullet}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().toggleOrderedList().run()'>{{lang.editor_ordered}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().setTextAlign("left").run()'>{{lang.editor_align_0}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().setTextAlign("center").run()'>{{lang.editor_align_1}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='editor.chain().focus().setTextAlign("right").run()'>{{lang.editor_align_2}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='ChooseImage'>{{lang.editor_image}}</n-button>
        <n-button secondary :size="is_full ? 'small' : 'tiny'" @click='ToggleFull'>{{is_full ? lang.editor_exit : lang.editor_full}}</n-button>
      </n-space>
      <n-scrollbar :style="{ maxHeight: is_full ? 'calc(100vh - 77px)' : normal_height }">
        <editor-content class='content' :editor='editor' />
      </n-scrollbar>
    </div>
  </div>
</template>

<script>
  import EditorImage from '@tiptap/extension-image'
  import EditorStarterKit from '@tiptap/starter-kit'
  import EditorUnderline from '@tiptap/extension-underline'
  import EditorTextAlign from '@tiptap/extension-text-align'
  import EditorPlaceholder from '@tiptap/extension-placeholder'

  import { Editor, EditorContent } from '@tiptap/vue-3'

  export default {
    props: {
      value: String,
      placeholder: String
    },
    emits: ['update:value', 'upload'],
    data: () => ({
      editor: null,
      is_full: false,
      normal_height: ''
    }),
    computed: mapState(['lang']),
    watch: {
      value(value) {
        this.editor.getHTML() != value && this.editor.commands.setContent(this.value, false)
      }
    },
    methods: {
      ChooseImage() {
        this.$photo().then(file => {
          let src = URL.createObjectURL(file)
          this.image_map[src] = file
          this.editor.commands.setImage({ src })
        })
      },
      ToggleFull() {
        this.is_full = !this.is_full
      },
      Upload() {
        let content = this.editor.getHTML()

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
    components: { EditorContent },
    mounted() {
      this.image_map = {}
      this.editor = new Editor({
        extensions: [
          EditorStarterKit,
          EditorUnderline,
          EditorTextAlign.configure({ types: ['heading', 'paragraph'] }),
          EditorImage.configure({ inline: true }),
          EditorPlaceholder.configure({ placeholder: this.placeholder })
        ],
        content: this.value,
        onUpdate: () => {
          let value = this.editor.getHTML()
          this.$emit('update:value', value == '<p></p>' ? '' : value)
        },
        onBlur: () => {
          let value = this.editor.getHTML()
          this.$emit('update:value', value == '<p></p>' ? '' : value)
        }
      })

      nextTick(() => this.normal_height = this.$refs.container.offsetHeight - this.$refs.toolbar.$el.offsetHeight - 15 + 'px')
    },
    beforeUnmount() {
      this.editor.destroy()
    }
  }
</script>
