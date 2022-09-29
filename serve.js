import fs from 'node:fs'
import { createServer } from 'vite'
import CreateConfig from './src/index.js'

const name = process.argv[2]

function CheckStat(path) {
  return new Promise(resolve => fs.stat(path, e => {
    e && console.log(`\n  指定目录不存在：${path}\n`)
    resolve(e)
  }))
}

if (await CheckStat(`src_${name}`)) process.exit()

const config = CreateConfig(name)
config.server.host = true

const server = await createServer({ configFile: false, ...config })

await server.listen()

process.stdout.cursorTo(0, 0)
process.stdout.clearScreenDown()

console.log('\n  开发服务器启动成功，可通过以下链接访问站点：')

server.resolvedUrls.local.forEach(i => console.log('\x1B[32m', `\n  ${i}`))
server.resolvedUrls.network.forEach(i => console.log('\x1B[32m', `\n  ${i}`))

console.log('\x1B[0m')
