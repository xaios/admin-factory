import 'vue-cropper/dist/index.css'
import '@root/style/index.styl'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueCropper from 'vue-cropper'

import route from '@root/tools/route'
import useRootStore from '@root/tools/store'
import useSelfStore from '@self/config/store'

import Copy from '@root/tools/copy'
import Preload from '@root/tools/preload'
import ChooseImage from '@root/tools/image'
import { Get, Post, Upload } from '@root/tools/request'
import { FormatTime, FormatNumber } from '@root/tools/format'
import { CreateButton, CreateSwitch, CreateImage } from '@root/tools/create_element'
import { Loading, Notice, Dialog, Message, ContextMenu, BackTop } from '@root/tools/operate'

import main from '@root/pages/container/index.vue'

import component_bar from '@root/components/bar/index.vue'
import component_form from '@root/components/form/index.vue'
import component_table from '@root/components/table/index.vue'
import component_vnode from '@root/components/vnode/index.vue'
import component_editor from '@root/components/editor/index.vue'
import component_image_picker from '@root/components/image-picker/index.vue'

const app = createApp(main)
app.use(createPinia()).use(route).use(VueCropper)

app.component('g-bar', component_bar)
app.component('g-form', component_form)
app.component('g-table', component_table)
app.component('g-vnode', component_vnode)
app.component('g-editor', component_editor)
app.component('g-image-picker', component_image_picker)

app.config.globalProperties.$get = Get
app.config.globalProperties.$post = Post
app.config.globalProperties.$copy = Copy
app.config.globalProperties.$spin = Loading
app.config.globalProperties.$notice = Notice
app.config.globalProperties.$dialog = Dialog
app.config.globalProperties.$upload = Upload
app.config.globalProperties.$message = Message
app.config.globalProperties.$backtop = BackTop
app.config.globalProperties.$preload = Preload
app.config.globalProperties.$time = FormatTime
app.config.globalProperties.$menu = ContextMenu
app.config.globalProperties.$photo = ChooseImage
app.config.globalProperties.$image = CreateImage
app.config.globalProperties.$store_root = useRootStore()
app.config.globalProperties.$store = useSelfStore()
app.config.globalProperties.$button = CreateButton
app.config.globalProperties.$number = FormatNumber
app.config.globalProperties.$switch = CreateSwitch
app.config.globalProperties.$pager = (source, index, size = 20) => source.slice((index - 1) * size, index * size)

export default app
