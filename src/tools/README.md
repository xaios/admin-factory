# 工具函数

## 创建按钮组件

通常在表格中使用，简化常见的按钮创建操作。

option 是 NButton 的 props：[查看文档](https://www.naiveui.com/zh-CN/os-theme/components/button)

```javascript
// this.$button = (option, text) => NButton | NTooltip

// option = {
//   ...NButton props
//   size  String  有文本则默认 small，否则默认 tiny
//   tips  String  有则创建并返回带 NTooltip 的按钮
//   type  String  默认 primary
//   icon  Icon    NIcon component 属性支持的图标组件
// }
// text    String  按钮文本

this.$button({ onClick: () => {} }, '新建')
// 等价于 h(NButton, { type: 'primary', size: 'small', onClick: () => {} }, () => '新建')
```

## 创建状态切换组件

通常在表格中使用，调一个接口切换数据状态，如是否上线。

```javascript
// this.$switch = (option) => NSwitch

// option = {
//   cgi       String           状态变化时请求的接口地址
//   id        String | Number  当前数据标识
//   params    Object           额外参数
//   value     Boolean          当前状态
//   onUpdate  Function         数据更新后调用的方法
//   ...       Any              其它 NSwitch 支持的配置项
// }

this.$switch({ cgi: 'Demo/cgi', id: row.id, params: { type: 2 }, value: row.status === 1, onUpdate: this.ReLoad })
```

## 创建图片组件

通常在表格中使用，简化创建的图片创建操作。

```javascript
this.$image(src, width = 120) // 宽度默认 120px
// 等价于 h(NImage, { showToolbar: false, src, width })
```

## 内容复制

使用 `JSON.stringify` 处理输入数据，支持直接复制大部分类型的数据到剪贴板。

```javascript
// this.$copy = (content) => void

this.$copy('1234567')
this.$copy(123456789)
this.$copy([1, 2, 3])
this.$copy({ a: 23 })
```

## 文件操作

常用的文件导入导出操作，需要导入后使用。

```javascript
import { ImportJson, ImportText, ExportJson, ExportText, ExportCsv } from '@root/tools/file'

// validator 文件属性校验，传入文件对象，支持 async、Promise、直接返回，返回 false 则不返回数据

// 导入 JSON，内含校验，只能导入 Object 或 Array 的文本数据，返回 JS 对象
// ImportJson(file => file.name.endsWith('json')).then(data => {})

// 导入文本，返回纯文本内容
// ImportText(validator).then(data => {})

// 导出 JSON，指定输出文件名，对数据先进行 JSON.stringify 处理再导出
// ExportJson(name, data)

// 导出文本，指定输出文件名，直接输出纯文本内容
// ExportText(name, data)

// 导出 csv
// ExportCsv(option)
// option = {
//   name  String         输出文件名，会自带 .csv 后缀
//   head  Array<Column>  参考 NDataTable 的表头配置，会自动过滤不含 key 的项，并自动合并 children 内容
//   list  Array<Object>  输出列表内容
// }
```

## 数据格式化

```javascript
// 时间格式化
// 参数一是可以被 new Date 的格式，会转换 - 为 /，当数值为秒数时会先转为毫秒再处理
// 参数二默认是 'yyyy-MM-dd hh:mm:ss'
this.$time(new Date, 'yyyy-MM-dd')

// 数值简化
// 就是变成以 k w kw 为单位显示，取两位小数
this.$number(100000000)
```

## 图片选择

可以直接选择文件，也可以裁剪指定比例，或单纯裁剪，返回一个文件对象。

```javascript
// this.$photo = (width: Number | undefined, height: Number | undefined, is_crop: Boolean) => File | undefined

// 直接选择图片，当图片不符合内置校验的时候将返回 undefined
this.$photo().then(file => {})

// 指定比例裁剪图片
this.$photo(100, 200).then(file => {})

// 任意裁剪图片
this.$photo(null, null, true).then(file => {})
```

## JSON 格式判断

判断字符串内容是否 Object 或 Array，需要导入后使用。

```javascript
import NormJson from '@root/tools/norm_json'

// NormJson = (data: String, option: { array_able: Boolean }) => object | undefined

// array_able 默认为 false，表示是否允许文件内容为 Array
// NormJson(data)
// NormJson(data, { array_able: true })
```

## 模态对话框

对 [NDialog](https://www.naiveui.com/zh-CN/os-theme/components/dialog) 的封装，代理与扩展部分功能。

```javascript
// 支持的配置内容及默认值
// option = {
//   ...NDialog Option            // 大部分参数都可以使用
//   title              String    // 默认“温馨提示”
//   text_0             String    // 等价 negativeText，默认“取消”
//   text_1             String    // 等价 positiveText，默认“确定”
//   Todo0              Function  // 存在时 Promise 无效，可以返回 false 取消默认动作（关闭对话框）
//   Todo1              Function  // 存在时 Promise 无效，可以返回 false 取消默认动作（关闭对话框）
// }

// 基础的调用方法，调用皆返回 Promise
// option 如果传字符串，则视为 option.content，其余配置取默认值：this.$dialog.success(content)
this.$dialog.info(option).then()
this.$dialog.error(option).then()
this.$dialog.success(option).then()
this.$dialog.warning(option).then()
this.$dialog.destroyAll()

// 确认框，会有一个取消按钮，点击调用 catch
this.$dialog.confirm(option).then().catch()
```

## 消息提示框

对 [NMessage](https://www.naiveui.com/zh-CN/os-theme/components/message) 的封装，代理与扩展部分功能。

```javascript
// 支持的配置内容及默认值
// option = {
//   ...NMessage Option          // 大部分参数都可以使用
//   duration            Number  // 默认 5000，closeable 时默认为 0
// }

// 基础的调用方法
// option 如果传字符串，则视为 option.content，其余配置取默认值：this.$message.info(content)
this.$message.info(option)
this.$message.error(option)
this.$message.success(option)
this.$message.warning(option)
this.$message.loading(option)
this.$message.destroyAll()

// 返回一个 Promise，提供 message 对象，可对其调用销毁方法
this.$message.info(option).then(message => message.destroy())
```

## 通知提示框

对 [NNotification](https://www.naiveui.com/en-US/os-theme/components/notification) 的封装，代理功能使用。

```javascript
// option 就是 NNotification Option

this.$notice.info(option)
this.$notice.error(option)
this.$notice.success(option)
this.$notice.warning(option)
this.$notice.destroyAll()
```

## 加载状态

```javascript
// 显示加载状态
// 第一参数为 true 时，必须通过 this.$spin.hide(true) 取消加载状态
// 第二参数为提示信息的内容
// this.$spin.show()
this.$spin.show(true, '提示信息')

// 取消加载状态
// this.$spin.hide()
this.$spin.hide(true)
```

## 回到顶部

页面内容部分滚动区域回到顶部。

```javascript
this.$backtop()
```

## 右键菜单

可以在任何地方调用的右键菜单。

```html
<div @contextmenu='Menu'></div>
```

```javascript
methods: {
  Menu(e) {
    // e 是鼠标事件的对象，或者构建有 preventDefault、clientX、clientY 三个属性的对象也行
    // option 是 NDropdown 的 options，参考文档：https://www.naiveui.com/en-US/os-theme/components/dropdown
    this.$menu(e, option).then(option => {
      // option 菜单选中项的原始对象
    })
  }
}
```

## 数据分页

传入原数据，第几页，分页量，返回分页结果，默认 20 条数据一页。

```javascript
// this.$pager = (list: Array, index: Number, size: Number) => Array

this.$pager([], 1)
```

## 预操作计数器

`Promise.all` 与 `await` 之类的方案都可以很方便地实现数据准备，但一些老的写法也能提供简单可用的帮助。

```javascript
// 如果传入的数值是 0，则立即调用后续操作
let Load = this.$preload(1, () => {})

// 每调用一次计数器加一，达到预设数值时执行后续操作
Load()
```

## 数据请求操作

```javascript
// 请求有 GET 跟 POST 两种，都返回一个 Promise
// 返回数据约定格式是 { code: 0, data: {}, message: '' }，then 中返回的 data 是此处的 data

// code 1 为轻提示，接口错误，用 NMessage 显示错误信息
// code 2 为重提示，接口错误，用 NDialog 显示错误信息
// code 3 为登录态异常，跟 HTTP 401 时一样，退出登录
// code 0 为接口正常，返回 data 供继续操作

// this.$get('cgi', { id: 1 }).then(data => {}).catch()

// POST 操作如果要在 URL 传参，可以在接口上加查询参数，即
// this.$post('cgi?id=1', { content: 2 })

// POST 带查询参数不好维护，所以有第二种写法，在 data 中增加会被处理掉的临时参数对象
// this.$post('cgi', { _params: { id: 1 }, content: 2 })

// 上传文件对象，返回网络路径
// this.$upload(File).then(path => {})
```
