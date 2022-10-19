import { createRouter, createWebHashHistory } from 'vue-router'

import useRootStore from '@root/tools/store'

import CONFIG from '@self/config/route'
import COMPONENT_SPACE from '@root/pages/space/index.vue'

const TOKEN = `pomelo_token_${location.origin}`

const PAGES = import.meta.glob('@self/pages/*/*.vue')
Object.keys(PAGES).forEach(i => PAGES[i.replace(/\/src_\w+\/pages/, 'pages')] = PAGES[i])

function FormatMenus(list, path = []) {
  return list.map(i => {
    if (i.hide) return ''

    let name = path.concat([i.name]).join('/')
    let item = { key: name, text: i.text, link: i.link, path: `/${name}`, children: i.list ? FormatMenus(i.list, [...path, i.name]) : undefined }

    return !item.list || item.children.length ? item : ''
  }).filter(i => i)
}

function RenderRoute(path, file, meta, name) {
  return {
    name: path,
    path: `/${path}`,
    component: COMPONENT_SPACE,
    children: [{ name: path, path: '', meta: { name: name || path, text: meta.text, keep: !!meta.keep }, component: PAGES[`pages/${file}.vue`] }]
  }
}

function FormatRoute(list) {
  let route = []

  list.forEach(i => {
    if (i.list) {
      route.push(RenderRoute(i.name, `${i.name}/${i.list[0].name}`, i.list[0]))
      i.list.forEach(n => route.push(RenderRoute(`${i.name}/${n.name}`, `${i.name}/${n.name}`, n)))
    } else {
      route.push(RenderRoute(i.name, `${i.name}/index`, i))
      route.push(RenderRoute(`${i.name}/index`, `${i.name}/index`, i, i.name))
    }
  })

  return route
}

const CONFIG_ROLE = {}
Object.keys(CONFIG).forEach(i => {
  if (i[0] != '_')
    CONFIG_ROLE[i] = { menus: FormatMenus(CONFIG[i]), route: FormatRoute(CONFIG[i]) }
})

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...(CONFIG._route || []).map(i => ({ path: `/${i.name}`, component: PAGES[`pages/${i.name}/index.vue`] })),
    { path: '/index', component: () => import('@self/index/index.vue') },
    { path: '/login', component: () => import('@root/pages/login/index.vue') },
    { path: '/space', name: 'space', meta: { auth: true }, component: COMPONENT_SPACE }
  ]
})

router.beforeEach(async (to, from) => {
  const store = useRootStore()

  if (localStorage[TOKEN] && !store.menu_route.length)
    try {
      await store.GetUserInfo()
      return to.fullPath
    } catch(e) {
      return false
    }

  if (!to.matched.length || (to.path == '/login' && localStorage[TOKEN]))
    return '/index'

  if (to.meta.auth && !localStorage[TOKEN])
    return '/login'

  if (to.fullPath == from.fullPath)
    return false
})

export function AddRoute(role) {
  CONFIG_ROLE[role].route.map(i => router.addRoute(i))
  useRootStore().$patch({
    menu: CONFIG_ROLE[role].menus,
    menu_route: CONFIG_ROLE[role].route,
    keep: new Set(router.getRoutes().filter(i => i.meta.keep).map(i => i.meta.name))
  })
}

export function ResetRoute(role) {
  CONFIG_ROLE[role].route.forEach(i => router.removeRoute(i.name))
}

export default router
