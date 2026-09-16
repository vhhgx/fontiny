import type { FontinyPlugin } from '../core/context.js'
import { createFont } from '../core/fontEngine.js'

export type RenameOptions = {
  family?: string
  subfamily?: string
  fullName?: string
  postscriptName?: string
  version?: string
}

export function rename(options: RenameOptions): FontinyPlugin {
  return {
    name: 'rename',
    async transform(asset) {
      const font = await createFont(asset.currentBuffer, asset.currentType, {
        hinting: true,
        kerning: true,
      })
      const data = font.get()

      data.name = {
        ...data.name,
        ...(options.family ? { fontFamily: options.family } : {}),
        ...(options.subfamily ? { fontSubFamily: options.subfamily } : {}),
        ...(options.fullName ? { fullName: options.fullName } : {}),
        ...(options.postscriptName ? { postScriptName: options.postscriptName } : {}),
        ...(options.version ? { version: options.version } : {}),
      }

      font.set(data)
      asset.currentBuffer = Buffer.from(
        font.write({
          type: 'ttf',
          toBuffer: true,
        })
      )
      asset.currentType = 'ttf'
      asset.meta.fontFamily = options.family ?? asset.meta.fontFamily
    },
  }
}
