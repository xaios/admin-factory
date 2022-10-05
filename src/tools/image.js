import LANG from '@root/tools/language'
import { default as Emitter, Message } from '@root/tools/operate'

export default function(width, height, is_crop) {
  return new Promise(resolve => {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      let file = input.files[0]

      if (file.type != 'image/jpeg' && file.type != 'image/png') {
        Message.warning(LANG.upload_format)
        resolve()
      } else if (file.size > 2097152) {
        Message.warning(LANG.upload_max_size)
        resolve()
      } else if (width || is_crop) {
        Emitter.emit('crop', file, width ? [width, height] : is_crop, resolve)
      } else {
        resolve(file)
      }
    }
    input.click()
  })
}
