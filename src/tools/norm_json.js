import { Dialog } from '@root/tools/operate'

export default function(data, option = {}) {
  if (!data.trim()) return

  try {
    data = JSON.parse(data.trim())
    if (!option.array_able && Array.isArray(data))
      Dialog.warning('请输入对象格式的 JSON')
    else if (data.toString() != '[object Object]')
      Dialog.warning('请输入正确的 JSON 格式内容')
    else
      return data
  } catch(e) {
    Dialog.warning({ title: 'JSON 格式错误，请检查数据内容', content: e.toString() })
  }
}
