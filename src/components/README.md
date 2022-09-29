# 全局组件

## 富文本编辑器

使用 [TipTap](https://www.tiptap.dev/) 实现的，相对简洁，相对能用。

### Props

| 名称 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| value | String | undefined | 富文本内容 |
| placeholder | String | undefined | 占位的文案 |
| on-update:value | (value: String) => void | undefined | 内容发生变化的回调函数 |
| on-upload | () => void | undefined | 临时图片完成上传的回调函数 |

### 使用说明
> 在表单组件中使用时下列操作将自动完成，仅在独立使用的时候需要手动处理。

```html
<!-- 已进行全局注册，需要指定 ref 并监听相关事件完成图片上传处理 -->
<g-editor v-model:value='value' @upload='Uploaded' ref='editor' />
```

```javascript
methods: {
  Submit() {
    // 1. 调用组件图片上传方法
    this.$refs.editor.Upload()
  },
  Uploaded() {
    // 2. 此时的组件值已完成更新，相关图片已替换为服务器路径
  }
}
```

## 图片选择组件

单图多图都可用，可以直接选择文件，也可以裁剪指定比例，或单纯裁剪。

### Props

| 名称 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| value | String \| Array\<String> | undefined | 图片内容 |
| crop | Boolean | false | 是否裁剪，配置了宽高相当于 true |
| width | Number | undefined | 裁剪宽度，需要配置 height |
| height | Number | undefined | 裁剪高度，需要配置 width |
| readonly | Boolean | false | 是否只读 |
| on-update:value | (value: String) => void | undefined | 内容发生变化的回调函数 |
| on-upload | () => void | undefined | 临时图片完成上传的回调函数 |

### 使用说明
> 如果在表单组件中使用的话下列操作将自动完成，仅在独立使用的时候需要手动处理。

```html
<!-- 已进行全局注册，需要指定 ref 并监听相关事件完成图片上传处理 -->
<g-image-picker :width='100' :height='100' v-model:value='value' @upload='Uploaded' ref='image' />
```

```javascript
methods: {
  Submit() {
    // 1. 调用组件图片上传方法
    this.$refs.image.Upload()
  },
  Uploaded() {
    // 2. 此时的组件值已完成更新，相关图片已替换为服务器路径
  }
}
```

## 表单组件

表单很常用，但配置起来很麻烦，所以搞了个轻松支持全屏与多列的表单弹窗，通过简单配置就能实现丰富的表单。

### Props

因为外层组件是 NModal，且使用了 NCard 预设，可直接使用相关的 props，如 title 等：[NModal](https://www.naiveui.com/zh-CN/os-theme/components/modal)，[NCard](https://www.naiveui.com/zh-CN/os-theme/components/card)

| 名称 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| full | Boolean | false | 是否全屏 |
| grid | Array\<Number> | [24] | 栅格分布，默认单列，总和须为 24 |
| width | String | 600px | 整体宽度 |
| loading | Boolean | false | 是否正在处理 |
| readonly | Boolean | false | 是否只读模式，仅缩小表单项间距 |
| labelWidth | Number | 100 | 标签宽度 |
| on-update:show | () => void | undefined | 显示发生变化 |
| on-submit | (FormData) => void | undefined | 完成数据处理，返回数据对象 |

### Methods

| 名称 | 类型	| 说明 |
| - | - | - |
| Init | (Array\<FormItem>) => void | 初始化表单内容并显示弹窗 |
| Hide | () => void | 关闭弹窗 |
| Check | (String) => void | 校验指定的表单项 |

### 使用说明

```html
<!-- 已进行全局注册，可直接使用 -->
<g-form title='表单示例' :grid='[12, 12]' :loading='loading' @submit='Submit' ref='form'>
  <template #slot></template>
</g-form>
```

```javascript
// 调用初始化方法并传入表单配置数组
this.$ref.form.Init([{
  name: 'name',                  // 数据的唯一标识，在返回数据时作为键值
  text: 'name',                  // 表单的标签文案
  must: true,                    // 字段是否必填，将自动扩展提示文案为：请配置 {name}
  value: row.name                // 初始值，若为 undefined 将根据类型配置为 null、[]、'' 或 false 等

  // type: 'select'              // 默认使用 NInput，通过 type 指定组件，具体映射查看源码，不同组件有不同的配置项支持，不一一列出
  // list: [                     // NSelect 的列表配置，必须为严格的 label value 配置
  //   { value: 0, label: '0' }
  // ]

  // grid: 1                     // 多列模式下此项所在的列序号，从 0 开始算
  // type: 'image'               // 使用 GImagePicker 进行图片管理，根据传入的值自动判断为单选还是多选
  // value: row.image || []      // 因为根据初始值判断模式，如果是多选模式，需要默认为 []，不能用 undefined

  // type: 'slot'                // 指定为 slot 时可以使用插槽，进行更复杂的表单内容配置

  // preset: 'sort'              // 指定 preset 时可以使用预设配置，配置项可覆盖，目前仅支持排序配置的预设

  // Check: model => Boolean     // 判断此表单项是否显示，model 为完整数据

  // rule: (val, model) => {     // 指定 rule 可自定义校验，val 为当前值，model 为完整数据
  //   if (val.length < 6)
  //     return new Error('密码不得少于六位')
  //   else if (row.id || val.length > 5)
  //     return true
  // }
}])

Submit(data) {
  // 提交事件返回的数据已经过深度复制，不会有引用类型的问题
}
```

## 页面顶栏组件

简单配置实现集刷新操作过滤于一体的顶栏。

### Props

| 名称 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| handle | String | undefined | 主按钮文案，不设置则无按钮，不设置内容则默认为：新建 |
| filter | Boolean | false | 显示搜索框 |
| sortList | Array\<{ label: String, value }> | undefiend | 过滤列表，不设置则无选择菜单 |
| on-handle | () => void | undefined | 点击主按钮操作 |
| on-reload | (index: Number, sort, search: String) => void | undefined | 点击刷新或触发过滤时 |

### 使用说明
```html
<!-- 已进行全局注册，可直接使用 -->
<g-bar handle filter @handle='Edit' @reload='Load'>
  <template #default></template>
  <template #right></template>
</g-bar>
```

```javascript
// 主要的交互点在加载逻辑上，主要有三个参数，同时这也是页面整体的一个加载逻辑
// 三个形参分别是页数、排序依据，以及查询内容
Load(index, sort, search) {
  this.sort = sort === undefined ? this.sort : sort
  this.search = search === undefined ? this.search : search
  this.index = index

  // 把相关数据缓存起来，翻页的时候可以保留相关查询参数进行接口调用
}
```

## 表格组件

之所以封个组件，是为了能够配置空白数据提示的 i18n，并进行一些通用配置

### Props

因为外层组件是 NDataTable，可直接使用相关的 props：[NDataTable](https://www.naiveui.com/zh-CN/os-theme/components/data-table)

### 使用说明

```html
<!-- 已进行全局注册，可直接使用，跟 NDataTable 一模一样 -->
<g-table :loading='loading' :columns='columns' :data='data' />
```
