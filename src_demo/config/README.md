# 项目基础配置内容

## config.json

```javascript
{
  "name": "Admin Demo",                                             // 项目标题
  "tips": "Powered by Pomelo Studio",                               // 登录页页脚文案
  "lang": "cn",                                                     // 项目基础语言包：cn、cht、en，默认 cn
  "path": "admin",                                                  // 项目路径基准，默认 admin
  "host": "https://demo-admin.muops.com/",                          // 接口请求转发地址
  "icon": "https://www.naiveui.com/assets/naivelogo.93278402.svg",  // 项目图标，默认为空，可用 @self 指代项目目录
  "port": 80,                                                       // 开发服务器监听端口，默认 80
  "sider_width": "14vw"                                             // 侧边栏宽度，默认 14vw
}
```

## language.js

项目私有的语言包配置，参考 `/src/tools/language.js`，设置对应的内容，也可以设置新的语句标识在项目中使用。

## route.js

包含所有权限可访问列表的配置信息，以权限身份为 Key。

- name：页面标识，若为子页面，将自动与父页面的 name 组合，格式为 `${parent_name}/${name}`
- text：菜单名称，同时作为 Tab 中的名称
- keep：是否缓存，存在于 Tab 时 <keep-alive> 将生效，需要组件内配置 name 属性，与 name 一致，因未知原因，此时 n-pagination 不能用 v-model:page，只能用 :page
- hide：是否隐藏，将不存在于侧边菜单，但路由可以正常访问，若访问也会出现在 Tab 中
- list：页面列表，文件管理以目录形式进行，不存在 list 时默认读取 name 目录下的 index.vue，若为 list 的内容将读取对应父目录下，以子页面 name 命名的单文件组件
- link：跳转地址，用以支持外部页面，将以新标签页的形式打开，需要随便给个 name 值

仅支持一二级菜单，也就是不能在 list 下套 list。

```javascript
export default {
  admin: [
    // { name: 'demo', text: 'Demo', keep: true, hide: true, link: 'https://demo.cn', list: [
    //   { name: 'omed', text: 'Omed' },
    //   { name: 'index', text: 'Index' }
    // ] },
    { name: 'count', text: '楼盘统计' },
    { name: 'building', text: '楼盘管理' },
    { name: 'article', text: '文章管理' },
    { name: 'advertising', text: '广告管理' },
    { name: 'system', text: '系统配置' }
  ]
}
```

## store.js

页面私有的数据库，一般不需要配置，可在全局环境下通过 `this.$store` 访问。

`PasswordValidate` 方法在修改密码时会被调用，可用于分析密码强度，：

```javascript
export default defineStore('self', {
  state: () => ({
    // 可以定义一个名为 copyright 的 VNode，将渲染在登录页页脚部分
    copyright: h('div', 'copyright'),
    // 可以定义图片选择大小，单位为 B，默认 2MB，设置 -1 跳过校验
    max_size: -1
  }),
  actions: {
    // 可以使用 async，也可以返回 Promise，数据返回必须使用 resolve
    PasswordValidate(context, data) {
      // 旧密码：data.old
      // 新密码：data.new
      // 默认直接返回 false，当返回值为 false 时将使用全局的校验逻辑，此方法未配置时也将使用去哪聚的校验逻辑
      // 返回 true 表示校验通过
      // 返回 new Error 将显示错误信息
      return false
    }
  }
})
```
