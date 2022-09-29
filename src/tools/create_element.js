import { NTooltip, NButton, NIcon, NSwitch } from 'naive-ui'
import { Post } from '@root/tools/request'
import { ref } from 'vue'

export function CreateButton(option, text) {
  let icon = option.icon, tips = option.tips
  delete option.icon
  delete option.tips

  option.size = option.size || (text ? 'small' : 'tiny')
  option.type = option.type || 'primary'

  let button = h(NButton, option, { icon: icon ? () => h(NIcon, { component: icon }) : undefined, default: () => text })

  return tips ? h(NTooltip, {}, { default: () => tips, trigger: () => button }) : button
}

export function CreateSwitch(option) {
  option.rubberBand = false
  option.onUpdateValue = value => {
    node.component.props.loading = true
    Post(option.cgi, { id: option.id }).then(() => {
      node.component.props.loading = false
      option.onUpdate()
    }).catch(() => node.component.props.loading = false)
  }

  const node = h(NSwitch, option)

  return node
}
