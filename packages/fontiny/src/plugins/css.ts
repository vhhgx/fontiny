import path from 'node:path'
import fs from 'fs-extra'
import type { FontinyAsset, FontinyFormat } from '../core/asset.js'
import type { FontinyPlugin } from '../core/context.js'
import { toUnicodeRange } from '../core/format.js'

export type CssOptions = {
  fontFamily?: string | ((asset: FontinyAsset) => string)
  familyFrom?: 'file' | 'parent-directory'
  fontWeight?: number | ((asset: FontinyAsset) => number)
  weightFrom?: 'file' | 'directory'
  fontStyle?: string | ((asset: FontinyAsset) => string)
  styleFrom?: 'file' | 'directory'
  fontDisplay?: string
  unicodeRange?: boolean
  basePath?: string
  local?: boolean
  filename?: string
  base64?: boolean
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

  if (options.fontFamily) {
    return options.fontFamily
  }

  if (options.familyFrom === 'parent-directory') {
    const parent = path.basename(path.dirname(asset.relativePath))
    if (parent && parent !== '.') {
      return parent
    }
  }

  return asset.meta.fontFamily ?? stripStyleSuffix(asset.basename)
}

const weightMap: Record<string, number> = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  'extra-light': 200,
  ultralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  book: 400,
  medium: 500,
  semibold: 600,
  'semi-bold': 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  'extra-bold': 800,
  black: 900,
  heavy: 900,
}

function tokens(asset: FontinyAsset, source: 'file' | 'directory') {
  const value =
    source === 'file'
      ? asset.basename
      : `${asset.relativePath} ${path.dirname(asset.relativePath)}`

  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
}

function inferWeight(asset: FontinyAsset, options: CssOptions) {
  if (typeof options.fontWeight === 'function') {
    return options.fontWeight(asset)
  }

  if (typeof options.fontWeight === 'number') {
    return options.fontWeight
  }

  const source = options.weightFrom ?? 'file'
  for (const token of tokens(asset, source)) {
    if (weightMap[token]) {
      return weightMap[token]
    }
  }

  return 400
}

function inferStyle(asset: FontinyAsset, options: CssOptions) {
  if (typeof options.fontStyle === 'function') {
    return options.fontStyle(asset)
  }

  if (options.fontStyle) {
    return options.fontStyle
  }

  const source = options.styleFrom ?? 'file'
  return tokens(asset, source).some((token) => token === 'italic' || token === 'oblique')
    ? 'italic'
    : 'normal'
}

function stripStyleSuffix(value: string) {
  return value
    .replace(/[-_ ]?(thin|hairline|extra[-_ ]?light|ultra[-_ ]?light|light|regular|normal|book|medium|semi[-_ ]?bold|demi[-_ ]?bold|bold|extra[-_ ]?bold|black|heavy|italic|oblique)$/i, '')
    .replace(/[-_ ]+$/, '') || value
}

function createRule(asset: FontinyAsset, options: CssOptions) {
  const sources = formatPriority
    .map((format) => asset.outputs.get(format))
    .filter(Boolean)
    .map((output) => {
      if (options.base64) {
        const contents = output!.contents
        const buffer = Buffer.isBuffer(contents) ? contents : Buffer.from(contents)
        return `url("data:font/${output!.kind};base64,${buffer.toString('base64')}") format("${formatLabel(output!.kind as FontinyFormat)}")`
      }

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
    `  font-weight: ${inferWeight(asset, options)};`,
    `  font-style: ${inferStyle(asset, options)};`,
    `  font-display: ${options.fontDisplay ?? 'swap'};`,
    ...(options.unicodeRange && asset.meta.subsetUnicodes?.length
      ? [`  unicode-range: ${toUnicodeRange(asset.meta.subsetUnicodes)};`]
      : []),
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
