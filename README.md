# Fontiny

Fontiny is a Node.js SDK and CLI for font subsetting, font conversion, and SVG iconfont generation.

The v0.2 line is focused on a publishable npm package:

- Subset `ttf`, `otf`, `woff`, and `woff2` fonts.
- Convert fonts to `ttf`, `woff`, `woff2`, and SVG font output.
- Generate icon fonts from SVG icon directories.
- Use a Fontmin-like chainable SDK.
- Use the same engine from CLI, Node scripts, or Nuxt server routes.

Fontiny does not require Fontmin, Python, fontTools, or system font binaries for the default engine.

## Requirements

- Node.js 18 or newer.

## Install

```bash
npm install fontiny
```

For local development in this repository:

```bash
npm install
npm run build
```

## CLI

### Subset Fonts

```bash
fontiny subset "input/**/*.{ttf,otf}" \
  --text "小楼一夜听春雨" \
  --formats ttf,woff,woff2,svg \
  --out output \
  --css \
  --manifest
```

### Convert Fonts

```bash
fontiny convert "input/**/*.{ttf,otf,woff,woff2}" \
  --formats woff2,woff \
  --out output
```

Subset and convert commands print a size report by default:

```text
assets/fonts/ysbth.ttf
  original: 1.3 MB
  woff2: 1.0 KB (99.9% reduced)
```

### Generate Iconfont

```bash
fontiny iconfont icons \
  --name fontiny-icons \
  --formats ttf,woff,woff2,svg \
  --out output/icons \
  --css \
  --types
```

Use a fixed codepoint map to keep icon unicode values stable:

```bash
fontiny iconfont icons \
  --name fontiny-icons \
  --codepoints iconfont.json \
  --out output/icons
```

### Inspect Fonts

```bash
fontiny inspect output/assets/fonts/ysbth.woff2 --unicodes
```

### Check Text Coverage

```bash
fontiny check output/assets/fonts/ysbth.woff2 --text "你好Fontiny"
```

### Collect Text From Source

```bash
fontiny collect "src/**/*.{vue,ts,tsx,html,md}" --out chars.txt
fontiny subset input/font.ttf --text-file chars.txt --formats woff2 --out output
```

### Preview Output

Preview starts a temporary local server instead of generating a new HTML file every time:

```bash
fontiny preview output --text "你好Fontiny"
```

### Initialize Config

```bash
fontiny init
```

### Watch Mode

```bash
fontiny subset "input/**/*.ttf" --text-file chars.txt --watch
fontiny convert "input/**/*.ttf" --formats woff2 --watch
fontiny iconfont icons --watch
```

## SDK

### Convenience API

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

### Plugin API

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

### Inspect and Check API

```ts
import { hasText, inspectFont } from 'fontiny'

const font = await inspectFont('output/assets/fonts/ysbth.woff2')
const result = hasText(font, '你好Fontiny')
```

### Iconfont API

```ts
import { iconfont } from 'fontiny/iconfont'

await iconfont()
  .src('icons')
  .name('fontiny-icons')
  .formats(['ttf', 'woff', 'woff2', 'svg'])
  .css(true)
  .types(true)
  .dest('output/icons')
  .run()
```

## Config

CLI commands can load `fontiny.config.js`:

```ts
export default {
  input: 'input/**/*.{ttf,otf}',
  output: 'output',
  text: '小楼一夜听春雨 深巷明朝卖杏花',
  formats: ['woff2'],
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

CLI flags override config values.

## Development

```bash
npm test
npm run build
npm run pack:dry
```

## Current Scope

Fontiny v0.2 intentionally does not include weight merging, variable fonts, TTC/OTC handling, or a browser runtime. Use it in Node.js, including Nuxt server routes or server plugins.

## License

MIT
