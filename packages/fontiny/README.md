# Fontiny

Fontiny 是一个面向 Node.js 的字体处理 SDK 和 CLI 工具，用于字体子集化、字体格式转换、SVG 图标转 iconfont，以及字体产物校验。

## 已完成功能

- 支持 `ttf`、`otf`、`woff`、`woff2` 输入。
- 支持字体子集化，按文本、文本文件或 unicode 列表裁剪字体。
- 支持输出 `ttf`、`woff`、`woff2`、SVG font。
- 支持 SVG 图标目录生成 iconfont。
- 支持固定 iconfont codepoint，避免图标 unicode 变化。
- 提供 Fontmin 风格链式 SDK：`.src().use().dest().run()`。
- 提供便捷 SDK：`.text().formats().css().run()`。
- 提供自定义 Fontiny 插件系统。
- 提供 `inspect`、`check`、`preview` 等校验和预览能力。
- 支持从源码文件收集字符。
- 支持 `fontiny.config.js` 配置文件。
- 支持 `watch` 模式。
- 支持 Nuxt server API 调用 SDK。
- 已移除旧 WebSocket 任务入口。

## 环境要求

- Node.js `>=18`

## 安装

```bash
npm install fontiny
```

本仓库本地开发：

```bash
npm install
npm run build
npm test
```

## CLI 使用

### 字体子集化

```bash
fontiny subset "input/**/*.{ttf,otf}" \
  --text "小楼一夜听春雨" \
  --formats ttf,woff,woff2,svg \
  --out output \
  --css \
  --manifest
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `[input]` | 输入字体文件或 glob，例如 `input/**/*.{ttf,otf}` | `input/**/*.{ttf,otf,woff,woff2}` |
| `--text <text>` | 直接传入需要保留的文本 | 无 |
| `--text-file <path>` | 从文本文件读取需要保留的字符 | 无 |
| `--unicodes <list>` | 传入 Unicode 列表，例如 `U+4E00,U+4E01` 或 `U+4E00-9FFF` | 无 |
| `--formats <list>` | 输出格式，逗号分隔，例如 `ttf,woff,woff2,svg` | `woff2` |
| `--out <dir>` | 输出目录 | `output` |
| `--css` | 生成 `fontiny.css` | 配置文件决定 |
| `--manifest` | 生成 `fontiny.manifest.json` | 配置文件决定 |
| `--no-report` | 关闭体积报告 | 默认输出体积报告 |
| `--watch` | 监听输入变化并重新处理 | `false` |
| `--engine builtin\|fonttools` | 选择字体处理引擎 | `builtin` |

### 字体格式转换

```bash
fontiny convert "input/**/*.{ttf,otf,woff,woff2}" \
  --formats woff2,woff \
  --out output
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `[input]` | 输入字体文件或 glob | `input/**/*.{ttf,otf,woff,woff2}` |
| `--formats <list>` | 输出格式，逗号分隔，例如 `woff2,woff` | `woff2` |
| `--out <dir>` | 输出目录 | `output` |
| `--no-report` | 关闭体积报告 | 默认输出体积报告 |
| `--watch` | 监听输入变化并重新处理 | `false` |

`subset` 和 `convert` 默认会输出体积报告：

```text
已处理 1 个字体文件。
文件：assets/fonts/ysbth.ttf
| 项目     | 格式  | 体积   | 压缩率 |
| -------- | ----- | ------ | ------ |
| 原始文件 | -     | 1.3 MB | -      |
| 输出文件 | woff2 | 1.0 KB | 99.9%  |
```

如需关闭：

```bash
fontiny subset input/font.ttf --text "你好" --no-report
```

### 查看字体信息

```bash
fontiny inspect output/assets/fonts/ysbth.woff2 --unicodes
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `<input>` | 要查看的字体文件路径 | 必填 |
| `--json` | 输出 JSON，便于脚本读取 | `false` |
| `--unicodes` | 输出 Unicode 列表 | `false` |

输出包括：

- 文件格式
- 字体 family
- subfamily
- glyph 数量
- unicode 数量
- 文件体积
- unicode 列表

### 检查字体是否包含指定文本

```bash
fontiny check output/assets/fonts/ysbth.woff2 --text "你好Fontiny"
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `<input>` | 要检查的字体文件路径 | 必填 |
| `--text <text>` | 直接传入需要检查的文本 | 无 |
| `--text-file <path>` | 从文本文件读取需要检查的字符 | 无 |
| `--json` | 输出 JSON，便于脚本读取 | `false` |

成功时：

```text
检查通过：全部 8 个字符均已包含。
```

缺字时：

```text
缺失字符：春 雨
```

也可以从文件读取：

```bash
fontiny check output/font.woff2 --text-file chars.txt
```

### 从源码收集字符

```bash
fontiny collect "src/**/*.{vue,ts,tsx,html,md}" --out chars.txt
fontiny subset input/font.ttf --text-file chars.txt --formats woff2 --out output
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `[input]` | 源码文件 glob | `src/**/*.{vue,ts,tsx,js,jsx,html,md,css}` |
| `--out <path>` | 输出文本文件路径 | 不传时直接输出到终端 |
| `--exclude <glob...>` | 排除指定 glob | `node_modules/**`、`dist/**`、`.git/**` |
| `--json` | 输出 JSON，便于脚本读取 | `false` |

该命令会扫描源码文件，收集可见字符并去重，适合真实前端项目自动生成子集文本。

### 启动预览页

```bash
fontiny preview output --text "你好Fontiny"
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `[input]` | 要预览的字体输出目录 | `output` |
| `--text <text>` | 预览文本 | `你好 Fontiny` |
| `--port <port>` | 预览服务端口 | `4173` |
| `--no-open` | 启动服务但不自动打开浏览器 | 默认自动打开 |

`preview` 会启动本地服务并展示输出目录中的字体。

预览页地址默认是 `http://localhost:4173`。HTML 模板固定在项目的 `templates/preview.html`，发布 npm 包时会一起打包。命令运行时会读取这个模板并填充当前输出目录中的字体列表。

页面会展示：

- 字体列表
- 预览文本渲染
- fallback 对比
- 字体格式
- 文件大小
- glyph 和 unicode 数量

### 初始化配置和目录

```bash
fontiny init
```

该命令没有额外参数。

会创建：

```text
fontiny.config.js
input/
icons/
output/
```

### 监听模式

```bash
fontiny subset "input/**/*.ttf" --text-file chars.txt --watch
fontiny convert "input/**/*.ttf" --formats woff2 --watch
fontiny iconfont icons --watch
```

`--watch` 是 `subset`、`convert`、`iconfont` 的通用参数，用来在输入文件变化后自动重新执行当前命令。

### SVG 图标生成 iconfont

```bash
fontiny iconfont icons \
  --name fontiny-icons \
  --formats ttf,woff,woff2,svg \
  --out output/icons \
  --css \
  --types
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `[input]` | SVG 图标目录 | `icons` |
| `--name <name>` | iconfont 的字体族名称 | `fontiny-icons` |
| `--formats <list>` | 输出格式，逗号分隔 | `ttf,woff,woff2,svg` |
| `--out <dir>` | 输出目录 | `output/icons` |
| `--css` | 生成 CSS | `true` |
| `--types` | 生成 TypeScript 类型声明 | `false` |
| `--start-codepoint <value>` | 起始 Unicode 码位，例如 `E001` 或 `0xE001` | `E001` |
| `--codepoints <path>` | 固定图标 codepoint 的 JSON 映射文件 | 无 |
| `--watch` | 监听图标目录并重新生成 | `false` |

固定 codepoint：

```bash
fontiny iconfont icons \
  --name fontiny-icons \
  --codepoints iconfont.json \
  --out output/icons
```

`iconfont.json` 示例：

```json
{
  "home": "E001",
  "user": "E002",
  "setting": "E003"
}
```

### 可选 fontTools 引擎

默认引擎是内置 Node/WASM 方案，不需要 Python。

可以先运行环境检查：

```bash
fontiny doctor
```

该命令没有额外参数。

示例输出：

```text
Fontiny 环境检查
Node.js：v24.14.0
内置引擎：可用
fontTools 引擎：未安装或当前 PATH 中找不到 pyftsubset
安装命令：pip install fonttools brotli
使用示例：fontiny subset input/font.ttf --engine fonttools --text "你好" --formats woff2
不需要 fontTools 时，可以继续使用默认内置引擎：--engine builtin
```

如果你需要使用 fontTools 的 `pyftsubset`，可以自行安装：

```bash
pip install fonttools brotli
```

然后显式启用：

```bash
fontiny subset input/font.ttf \
  --engine fonttools \
  --text-file chars.txt \
  --formats ttf,woff2 \
  --out output
```

如果本机没有 `pyftsubset`，会提示：

```text
fontTools 引擎不可用。安装命令：pip install fonttools brotli。也可以继续使用默认内置引擎：--engine builtin。
```

## SDK 使用

### 便捷 API

```ts
import Fontiny from 'fontiny'

await Fontiny()
  .src('input/**/*.{ttf,otf}')
  .text('小楼一夜听春雨')
  .formats(['woff2', 'woff'])
  .css()
  .dest('output')
  .run()
```

### 插件 API

`.use(plugin())` 使用的是 Fontiny 自己的插件系统，不是 Gulp 插件。

```ts
import Fontiny from 'fontiny'
import { subset, convert, css, manifest, rename } from 'fontiny/plugins'

await Fontiny()
  .src('input/**/*.{ttf,otf}')
  .use(subset({ text: '小楼一夜听春雨' }))
  .use(rename({ family: 'MyFont' }))
  .use(convert({ formats: ['ttf', 'woff', 'woff2', 'svg'] }))
  .use(css({ fontFamily: 'MyFont', unicodeRange: true }))
  .use(manifest())
  .dest('output')
  .run()
```

插件接口形态：

```ts
type FontinyPlugin = {
  name: string
  transform?: (asset, ctx) => Promise<void> | void
  afterAll?: (assets, ctx) => Promise<void> | void
}
```

### inspect / check API

```ts
import { hasText, inspectFont } from 'fontiny'

const font = await inspectFont('output/assets/fonts/ysbth.woff2')
const result = hasText(font, '你好Fontiny')
```

### iconfont API

```ts
import { iconfont } from 'fontiny/iconfont'

await iconfont()
  .src('icons')
  .name('fontiny-icons')
  .formats(['ttf', 'woff', 'woff2', 'svg'])
  .css(true)
  .types(true)
  .codepoints('iconfont.json')
  .dest('output/icons')
  .run()
```

## 配置文件

CLI 会自动读取 `fontiny.config.js`。

```ts
export default {
  input: 'input/**/*.{ttf,otf}',
  output: 'output',
  text: '小楼一夜听春雨 深巷明朝卖杏花',
  formats: ['woff2'],
  engine: 'builtin',
  css: true,
  manifest: true,
  watch: false,
  iconfont: {
    input: 'icons',
    output: 'output/icons',
    name: 'fontiny-icons',
    formats: ['ttf', 'woff', 'woff2', 'svg'],
    css: true,
    types: true,
    startCodepoint: 0xe001,
    codepoints: 'iconfont.json'
  }
}
```

优先级：

```text
CLI 参数 > 配置文件 > 默认值
```

## CSS 输出能力

`css()` 插件已支持：

- `font-family`
- `font-weight`
- `font-style`
- `font-display`
- `unicode-range`
- base64 内联
- 根据文件名或目录推断 family / weight / style
- 多字体合并到一个 `fontiny.css`

示例：

```ts
css({
  familyFrom: 'parent-directory',
  weightFrom: 'file',
  styleFrom: 'file',
  unicodeRange: true,
  fontDisplay: 'swap'
})
```

## Nuxt Server API

仓库中已经提供 Nuxt server routes，直接调用 SDK。

### 子集化

```ts
await $fetch('/api/fontiny/subset', {
  method: 'POST',
  body: {
    input: 'input/**/*.{ttf,otf}',
    output: 'output',
    text: '你好Fontiny',
    formats: ['woff2'],
    css: true,
    manifest: true
  }
})
```

### 查看字体信息

```text
GET /api/fontiny/inspect?file=output/font.woff2
```

### 检查文本覆盖

```text
POST /api/fontiny/check
```

请求体：

```json
{
  "file": "output/font.woff2",
  "text": "你好Fontiny"
}
```

旧的 `8080` WebSocket 任务入口已经删除，避免任意 WebSocket 消息触发本机字体处理任务。

## 开发命令

```bash
npm test
npm run build
npm audit
npm run pack:dry
```

当前测试覆盖：

- SDK 子集化和转换
- 插件组合
- inspect / check
- collect
- init
- iconfont
- 固定 codepoint
- watch helper
- fontTools 缺失提示
- Windows 路径兼容

## 当前边界

当前版本暂不支持：

- 字重合并
- variable font 生成
- TTC / OTC 字体集合处理
- 浏览器端直接运行 SDK

SDK 和 CLI 均面向 Node.js 环境。Nuxt 中请在 server route 或 server plugin 内调用。

## License

MIT
