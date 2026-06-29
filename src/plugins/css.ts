import path from 'node:path'
import fs from 'fs-extra'
import type { FontinyAsset, FontinyFormat } from '../core/asset.js'
import type { FontinyPlugin } from '../core/context.js'

export type CssOptions = {
  fontFamily?: string | ((asset: FontinyAsset) => string)
  basePath?: string
  local?: boolean
  filename?: string
}

const formatPriority: FontinyFormat[] = ['woff2', 'woff', 'ttf', 'otf', 'svg']

const formatLabel = (format: FontinyFormat) => {
  if (format === 'ttf' || format === 'otf') {
    return 'truetype'
  }

  if (format === 'svg') {
    return 'svg'
  }

  return format
}

const slash = (value: string) => value.split(path.sep).join('/')

function getFamily(asset: FontinyAsset, options: CssOptions) {
  if (typeof options.fontFamily === 'function') {
    return options.fontFamily(asset)
  }

  return options.fontFamily ?? asset.meta.fontFamily ?? asset.basename
}

function createRule(asset: FontinyAsset, options: CssOptions) {
  const sources = formatPriority
    .map((format) => asset.outputs.get(format))
    .filter(Boolean)
    .map((output) => {
      const basePath = options.basePath ? options.basePath.replace(/\/$/, '') : '.'
      const url = slash(`${basePath}/${path.dirname(asset.relativePath)}/${output!.filename}`)
        .replace('/./', '/')
        .replace(/^\.\//, './')
      return `url("${url}") format("${formatLabel(output!.kind as FontinyFormat)}")`
    })

  if (sources.length === 0) {
    return ''
  }

  const sourceParts = [
    ...(options.local === false ? [] : [`local("${getFamily(asset, options)}")`]),
    ...sources,
  ]

  return [
    '@font-face {',
    `  font-family: "${getFamily(asset, options)}";`,
    `  src: ${sourceParts.join(',\n       ')};`,
    '  font-display: swap;',
    '}',
  ].join('\n')
}

export function css(options: CssOptions = {}): FontinyPlugin {
  return {
    name: 'css',
    async afterAll(assets, ctx) {
      const rules = assets.map((asset) => createRule(asset, options)).filter(Boolean)
      if (rules.length === 0) {
        return
      }

      await fs.ensureDir(ctx.outputDir)
      await fs.writeFile(
        path.join(ctx.outputDir, options.filename ?? 'fontiny.css'),
        `${rules.join('\n\n')}\n`,
        'utf8'
      )
    },
  }
}
