import TinyEmitter from 'tiny-emitter'

import LANG from '@root/tools/language'

const Emitter = new TinyEmitter

export default Emitter

export const Loading = {
  hard: false,
  show(hard, desc = '') {
    this.hard = this.hard || hard === true
    Emitter.emit('spin', true, desc)
  },
  hide(hard, desc = '') {
    if (this.hard && hard !== true) return
    this.hard = false
    Emitter.emit('spin', false, desc)
  }
}

export const Notice = new Proxy({}, {
  get: (_, type) => config => Emitter.emit('notice', type, config)
})

function DialogHandle(type, config = {}) {
  return new Promise((resolve, reject) => {
    let content = typeof config == 'string' ? config : config.content
    config = typeof config == 'string' ? { content } : config

    if (type == 'confirm') {
      type = 'warning'
      config.text_0 = config.text_0 || LANG.cancel
    }

    config.title = config.title || LANG.warn_prompt
    config.positiveText = config.text_1 || LANG.confirm
    config.negativeText = config.text_0
    config.onPositiveClick = () => config.Todo1 ? config.Todo1() : resolve()
    config.onNegativeClick = () => config.Todo0 ? config.Todo0() : reject()

    Emitter.emit('dialog', type, config, resolve, reject)
  })
}

export const Dialog = new Proxy({}, {
  get: (_, type) => config => DialogHandle(type, config)
})

function MessageHandle(type, config = {}) {
  let content = typeof config == 'string' ? config : config.content
  config = typeof config == 'string' ? {} : config

  config.duration = config.duration ?? (config.closable ? 0 : 5000)

  Emitter.emit('message', type, content, config)
}

export const Message = new Proxy({}, {
  get: (_, type) => config => MessageHandle(type, config)
})

export function ContextMenu(e, option) {
  return new Promise(resolve => Emitter.emit('menu', e, option, resolve))
}

export function BackTop() {
  Emitter.emit('backtop')
}
