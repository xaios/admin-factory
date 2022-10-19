# 前言

管理后台是同质化很严重的产品，可能也是最适合量产的，在本项目之前我实现过一个能快速开发的后台，已经在项目中量产，但实际应用中遇到了不少问题，包括但不限于：

- 新建一个后台，需要复制一份原型，而依赖文件数量几近十万，无论是重新下载还是复制都浪费很多时间。
- 基础文件更新不同步，无论是依赖还是一些组件，一个后台一份代码，差异无从管理，新特性在原型上同步后，再同步到其它后台只能手动修改，有改错的风险。
- 作为量产项目，只需要改几个配置，再加几个页面就可以完成一个后台，而原来因为基础文件跟私有文件混在一起，不能做到关注点分离，同样有误操作风险。

随着后台数量增多，这些问题越来越突出，到了不得不解决的程度，无论从开发还是管理的角度出发，都需要一套完善的方案，大概想过几个方向：

- 所有项目放同一目录中，`package.json` 单一管理，`npm run serve` 加参数，指定执行哪个项目。
  > npm 脚本加参数的语法很长，不现实，底层是用 vite 实现的，接收参数的语法更长，对开发而言极其不友好。

- 开发状态的项目为 `src`，处于静默状态的项目为 `src_${name}`，配置能相对固定，在切换项目的时候先修改项目名，可以用批处理等实现改名自动化。
  > 如果两个项目需要同时开发那这套方案就废了，自动化批处理也是要处理，开发体验还是不佳。

反复翻阅 Vite3 的文档后，我确信 npm 脚本是没办法兼顾开发跟管理的，转念一想，Node.js 是支持直接运行 js 的，还可以接收参数与执行命令，或许我可以写一个脚本，执行后自动完成数据分析然后调用子进程执行我需要执行的那个 `npm run serve`。

在了解了 Vite3 支持以函数启动开发与构建后，这个流程得以简化，而具体的方案也敲定下来了：

1. 抛弃 npm 脚本，手动编写脚本分析数据并启动相关服务。
2. 后台基础文件放 `src` 目录，项目私有文件放 `src_${name}` 目录，开发跟构建就是 `node serve/build name`，一句话的事。
3. 尽可能地简化私有目录内容，尽可能做到配置化，同时要考虑任何可能的扩展方向。

具体实现上遇到不少问题，这里就不展开说了，最终的成品可以说是完美符合了预期，有一点需要注意的是，基础配置是全局的，所有更新都会对所有后台生效，需要提防不兼容的情况。

众所周知后台不能没有接口支持，离开后台预设的接口要直接运行是不可能的，接口相关配置必定要修改，在此开源前端部分，仅是为了展示一种项目的可能性。

[项目预览地址](https://demo-admin.muops.com/)

# 使用方法

1. 复制原型目录，或曾经的某一个项目目录，修改相关配置：目录名、项目配置、路由配置。
2. `node serve ${name}` 启动开发服务器。
3. 根据路由配置修改页面目录，并编写其中的业务逻辑。
4. `node build ${name}` 启动构建，完成。
5. `${name}` 也可作 `src_${name}`，命令会自动判断处理前面的 `src_`。

# 约定规范

全局组件注册时，系统全局组件前缀为 `g-`，项目私有组件前缀为 `i-`，第三方组件前缀为 `c-`。

# 主要目录结构

- src，项目基础文件内容，私有文件内容建议与其子目录结构一致
  - components，全局组件目录，具体说明在目录内的 README.md 中
  - image，全局图片目录
  - pages，框架页面与登录页面
  - style，全局样式
  - tools，全局工具函数，包括项目初始化与路由初始化等内容，具体说明在目录内的 README.md 中
  - index.js，是 vite.config.js 的生成逻辑
- src_${name}，具体后台的私有文件
  - config，后台配置内容，具体说明在目录内的 README.md 中
    - config.json，后台基础配置
    - language.js，私有语言包配置
    - route.js，路由与菜单配置
    - store.js，后台数据库配置
  - index，后台首页
  - pages，后台页面内容，具体使用方法参考其中的代码即可
  - index.js，后台初始化方法，可以在这里注册一些全局方法或组件
- build.js，启动构建
- serve.js，启动开发服务器
- index.html，项目入口模板
