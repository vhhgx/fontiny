# Fontiny

Fontiny 是一个面向 Node.js 的字体处理 SDK 和 CLI 工具，用于字体子集化、字体格式转换、SVG 图标转 iconfont，以及字体产物校验。

当前版本重点是把 Fontiny 做成一个可以发布到 npm 的工具包。默认引擎不依赖 Fontmin、Python、fontTools 或系统字体工具；需要更高保真子集化时，也可以显式启用可选的 fontTools 引擎。

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

- `--text <text>`：直接传入需要保留的文本。
- `--text-file <path>`：从文本文件读取需要保留的字符。
- `--unicodes <list>`：传入 unicode 列表，例如 `U+4E00,U+4E01` 或 `U+4E00-9FFF`。
- `--formats <list>`：输出格式，逗号分隔，例如 `woff2,woff`。
- `--out <dir>`：输出目录。
- `--css`：生成 `fontiny.css`。
- `--manifest`：生成 `fontiny.manifest.json`。
- `--watch`：监听输入变化并重新处理。
- `--engine builtin|fonttools`：选择字体处理引擎。

### 字体格式转换

```bash
fontiny convert "input/**/*.{ttf,otf,woff,woff2}" \
  --formats woff2,woff \
  --out output
```

`subset` 和 `convert` 默认会输出体积报告：

```text
assets/fonts/ysbth.ttf
  original: 1.3 MB
  woff2: 1.0 KB (99.9% reduced)
```

如需关闭：

```bash
fontiny subset input/font.ttf --text "你好" --no-report
```

### 查看字体信息

```bash
fontiny inspect output/assets/fonts/ysbth.woff2 --unicodes
```

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

成功时：

```text
OK: all 8 characters included
```

缺字时：

```text
Missing: 春 雨
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

该命令会扫描源码文件，收集可见字符并去重，适合真实前端项目自动生成子集文本。

### 启动预览页

```bash
fontiny preview output --text "你好Fontiny"
```

`preview` 会启动临时本地服务并展示输出目录中的字体，不会每次生成新的 HTML 文件。

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

### SVG 图标生成 iconfont

```bash
fontiny iconfont icons \
  --name fontiny-icons \
  --formats ttf,woff,woff2,svg \
  --out output/icons \
  --css \
  --types
```

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
fontTools engine is not available.
Install with: pip install fonttools brotli.
Or use default engine: --engine builtin.
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
