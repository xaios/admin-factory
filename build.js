import fs from 'node:fs'
import { build } from 'vite'
import CreateConfig from './src/index.js'

const name = process.argv[2]

function CheckStat(path) {
  return new Promise(resolve => fs.stat(path, e => {
    e && console.log(`\n  指定目录不存在：${path}\n`)
    resolve(e)
  }))
}

if (await CheckStat(`src_${name}`)) process.exit()

console.log('')

build({ configFile: false, ...CreateConfig(name), build: { reportCompressedSize: false, chunkSizeWarningLimit: 2048 } })
