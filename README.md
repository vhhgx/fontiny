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

### Generate Iconfont

```bash
fontiny iconfont icons \
  --name fontiny-icons \
  --formats ttf,woff,woff2,svg \
  --out output/icons \
  --css \
  --types
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
import { subset, convert, css, manifest } from 'fontiny/plugins'

await Fontiny()
  .src('input/**/*.{ttf,otf}')
  .use(subset({ text: '小楼一夜听春雨' }))
  .use(convert({ formats: ['ttf', 'woff', 'woff2', 'svg'] }))
  .use(css({ fontFamily: 'MyFont' }))
  .use(manifest())
  .dest('output')
  .run()
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
  iconfont: {
    input: 'icons',
    output: 'output/icons',
    name: 'fontiny-icons',
    formats: ['ttf', 'woff', 'woff2', 'svg'],
    css: true,
    types: true,
    startCodepoint: 0xe001
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
