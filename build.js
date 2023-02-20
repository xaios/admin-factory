import { build } from 'vite'
import { stat } from 'node:fs/promises'
import CreateConfig from './src/index.js'

const path = process.argv[2].startsWith('src_') ? process.argv[2] : `src_${process.argv[2]}`

if (!await stat(path).catch(() => {})) {
  console.log(`\n  项目目录不存在：${path}\n`)
  process.exit()
}

console.log('')

const config = CreateConfig(path.slice(4), process.argv[3] === 'true')
config.build = { reportCompressedSize: false, chunkSizeWarningLimit: 2048 }

build(config)
