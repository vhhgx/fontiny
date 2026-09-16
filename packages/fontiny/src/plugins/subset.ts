import fs from 'fs-extra'
import type { FontinyAsset } from '../core/asset.js'
import type { FontinyContext, FontinyPlugin } from '../core/context.js'
import { createFont, ensureWoff2 } from '../core/fontEngine.js'
import { textToCodePoints } from '../core/text.js'

export type SubsetOptions = {
  text?: string
  textFile?: string
  unicodes?: number[]
  hinting?: boolean
  kerning?: boolean
}

async function resolveSubset(options: SubsetOptions) {
  const codePoints = new Set<number>()

  if (options.text) {
    textToCodePoints(options.text).forEach((codePoint) => codePoints.add(codePoint))
  }

  if (options.textFile) {
    const text = await fs.readFile(options.textFile, 'utf8')
    textToCodePoints(text).forEach((codePoint) => codePoints.add(codePoint))
  }

  options.unicodes?.forEach((codePoint) => codePoints.add(codePoint))

  return [...codePoints]
}

export function subset(options: SubsetOptions): FontinyPlugin {
  return {
    name: 'subset',
    async transform(asset: FontinyAsset, _ctx: FontinyContext) {
      const subsetCodePoints = await resolveSubset(options)

      if (subsetCodePoints.length === 0) {
        return
      }

      if (asset.currentType === 'woff2') {
        await ensureWoff2()
      }

      const font = await createFont(asset.currentBuffer, asset.currentType, {
        subset: subsetCodePoints,
        hinting: options.hinting ?? false,
        kerning: options.kerning ?? true,
      })

      asset.currentBuffer = Buffer.from(
        font.write({
          type: 'ttf',
          toBuffer: true,
          hinting: options.hinting ?? false,
        })
      )
      asset.currentType = 'ttf'
      asset.meta.subsetText = options.text
      asset.meta.glyphCount = subsetCodePoints.length
      asset.meta.subsetUnicodes = subsetCodePoints
    },
  }
}
