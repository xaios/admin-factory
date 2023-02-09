import ClipboardJS from 'clipboard'
import { Message } from '@root/tools/operate'

export default function(text, e) {
  text = typeof text === 'string' ? text : JSON.stringify(text)

  let node = document.createElement('button')
  let temp = new ClipboardJS(node, { container: e?.currentTarget, text: () => text })

  temp.on('success', () => Message.success(`复制成功：${text}`))
  temp.on('error', () => Message.error({ duration: 0, content: `复制失败：${text}` }))

  node.click()
  temp.destroy()
}
