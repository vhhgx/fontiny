import type { FontinyAsset, FontinyFormat } from '../core/asset.js'
import type { FontinyPlugin } from '../core/context.js'
import { writeFont } from '../core/fontEngine.js'

export type ConvertOptions = {
  formats: FontinyFormat[]
  hinting?: boolean
}

const outputFilename = (asset: FontinyAsset, format: FontinyFormat) => {
  return `${asset.basename}.${format}`
}

export function convert(options: ConvertOptions): FontinyPlugin {
  return {
    name: 'convert',
    async transform(asset) {
      for (const format of options.formats) {
        const contents = await writeFont(asset.currentBuffer, asset.currentType, format, {
          hinting: options.hinting ?? false,
        })

        asset.outputs.set(format, {
          kind: format,
          filename: outputFilename(asset, format),
          contents,
        })
      }
    },
  }
}
