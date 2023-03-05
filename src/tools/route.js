import { createRouter, createWebHashHistory } from 'vue-router'

import useRootStore from '@root/tools/store'

import CONFIG from '@self/config/route'
import COMPONENT_SPACE from '@root/pages/space/index.vue'

const FILES = import.meta.glob('@self/pages/**/*.vue')
Object.keys(FILES).forEach(i => FILES[i.replace(/\/src_\w+\/pages\//, '').replace(/\.vue$/, '')] = FILES[i])

function FormatMenus(list, path = []) {
  return list.map(i => {
    if (i.hide || i.pure) return null

    let name = path.concat(i.name).join('/')
    let item = { key: name, text: i.text, path: `/${name}` }

    if (i.link) item.link = i.link
    if (i.list) item.children = FormatMenus(i.list, [...path, i.name])

    return !i.list || item.children.length ? item : null
  }).filter(i => i)
}

function FormatRoute(list, path = []) {
  return list.map(i => {
    let name = path.concat(i.name).join('/')
    let file = FILES[path.length ? name : `${name}/index`]

    if (i.list)
      return [
        { path: `/${name}`, name, redirect: `/${name}/${i.list[0].name}` },
        ...FormatRoute(i.list, [...path, i.name])
      ]
    else
      return i.pure ?
        { path: `/${name}`, name, component: file } :
        { path: `/${name}`, component: COMPONENT_SPACE, children: [
          { path: '', name, component: file, meta: { name, text: i.text, keep: !!i.keep } }
        ] }
  })
}

const CONFIG_ROLE = {}
Object.keys(CONFIG).forEach(i => {
  CONFIG_ROLE[i] = { menus: FormatMenus(CONFIG[i]), route: FormatRoute(CONFIG[i]).flat(Infinity) }
})

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', component: () => import('@root/pages/login/index.vue') },
    { path: '/index', component: FILES['index/index'] || (() => import('@root/pages/index/index.vue')) },
    { path: '/space', name: 'space', meta: { auth: true }, component: COMPONENT_SPACE }
  ]
})

router.beforeEach(async (to, from) => {
  const store = useRootStore()

  if (SESSION[TOKEN] && !store.menu_default)
    try {
      await store.InitUser()
      return to.fullPath
    } catch {
      return false
    }

  if (!to.matched.length || (to.path === '/login' && SESSION[TOKEN]))
    return '/index'

  if (to.meta.auth && !SESSION[TOKEN])
    return '/login'

  if (to.fullPath === from.fullPath)
    return false
})

export function CreateRoute(role) {
  CONFIG_ROLE[role].route.forEach(i => router.addRoute(i))

  useRootStore().$patch({
    menu: CONFIG_ROLE[role].menus,
    menu_default: CONFIG_ROLE[role].route[0].path,
    keep: new Set(router.getRoutes().filter(i => i.meta.keep).map(i => i.meta.name))
  })
}

export function RemoveRoute(role) {
  CONFIG_ROLE[role].route.forEach(i => router.removeRoute(i.name))
}

export default router
