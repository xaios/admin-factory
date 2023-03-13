import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { Message } from '@root/tools/operate'

export default function(source) {
  source = typeof source === 'string' ? source : JSON.stringify(source)

  useClipboard({ source, legacy: true }).copy()
  Message.success(`复制成功：${source}`)
}
