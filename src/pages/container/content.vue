<template>
  <router-view #default='{ Component }'>
    <transition name='fade'>
      <component :is='Component' />
    </transition>
  </router-view>
</template>

<script setup>
  import Emitter from '@root/tools/operate'
  import { useDialog, useMessage, useNotification } from 'naive-ui'

  const Dialog = useDialog()
  Emitter.on('dialog', ([mode, config]) => Dialog[mode](config))

  const Message = useMessage()
  Emitter.on('message', ([mode, text, config, resolve]) => resolve(Message[mode](text, config)))

  const Notice = useNotification()
  Emitter.on('notice', ([mode, config]) => Notice[mode](config))
</script>
