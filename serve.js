import { createServer } from 'vite'
import { stat } from 'node:fs/promises'
import CreateConfig from './src/index.js'

const path = process.argv[2].startsWith('src_') ? process.argv[2] : `src_${process.argv[2]}`

if (!await stat(path).catch(() => {})) {
  console.log(`\n  项目目录不存在：${path}\n`)
  process.exit()
}

const config = CreateConfig(path.slice(4))
config.server.host = true

const server = await createServer(config)
await server.listen()

process.stdout.cursorTo(0, 0)
process.stdout.clearScreenDown()

console.log('\n  开发服务器启动成功，可通过以下链接访问站点：')

server.resolvedUrls.local.forEach(i => console.log('\x1B[32m', `\n  ${i}`))
server.resolvedUrls.network.forEach(i => console.log('\x1B[32m', `\n  ${i}`))

console.log('\x1B[0m')
