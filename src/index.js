import fs from 'node:fs'
import path from 'node:path'

import Vue from '@vitejs/plugin-vue'
import Archiver from '@xaios/vite-plugin-archiver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

function TransformHTML(html, root, config) {
  html = html.replace('%=ICON%', (config.icon || '').replace('@self', root)).replace('%=SRC%', `/${root}/index.js`).replace(/[ ]+</ig, '<')

  ;[/\n+/g, /<!--.*?-->/ig, /\/\*.*?\*\//ig].forEach(i => html = html.replace(i, ''))
  return html
}

export default function(name, origin = false) {
  const root = `src_${name}`
  const config = JSON.parse(fs.readFileSync(`${root}/config/config.json`, 'utf-8'))

  return {
    configFile: false,
    base: process.env.NODE_ENV === 'production' ? `/${config.path || 'admin'}/` : '/',
    server: {
      port: config.port || 80,
      proxy: {
        '/api': { target: config.host, secure: false }
      }
    },
    resolve: {
      alias: {
        '@root': path.join(process.cwd(), 'src'),
        '@self': path.join(process.cwd(), root),
      }
    },
    plugins: [
      {
        name: 'transform-html-serve',
        transformIndexHtml: html => TransformHTML(html, root, config)
      },
      {
        name: 'transform-html-build',
        apply: 'build',
        transform: (code, id) => id.endsWith('.html') ? TransformHTML(code, root, config) : code
      },
      Vue(),
      AutoImport({ imports: [{ vue: ['h', 'nextTick', 'markRaw'] }] }),
      Components({ resolvers: [NaiveUiResolver()] }),
      Archiver({ name, origin, result_pre: '_admin', origin_pre: '_origin', ignore_folder: ['repositories', `src_!(${name})`] })
    ]
  }
}
