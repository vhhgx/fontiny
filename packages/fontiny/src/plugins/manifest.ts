import path from 'node:path'
import fs from 'fs-extra'
import type { FontinyPlugin } from '../core/context.js'

export type ManifestOptions = {
  filename?: string
}

export function manifest(options: ManifestOptions = {}): FontinyPlugin {
  return {
    name: 'manifest',
    async afterAll(assets, ctx) {
      const files = assets.map((asset) => ({
        input: asset.inputPath,
        family: asset.meta.fontFamily ?? asset.basename,
        originalSize: asset.originalBuffer.length,
        outputs: [...asset.outputs.values()].map((output) => ({
          path: ctx.resolveOutputPath(asset, output.filename),
          format: output.kind,
          size: Buffer.isBuffer(output.contents)
            ? output.contents.length
            : Buffer.byteLength(output.contents),
        })),
      }))

      await fs.ensureDir(ctx.outputDir)
      await fs.writeJson(
        path.join(ctx.outputDir, options.filename ?? 'fontiny.manifest.json'),
        { files },
        { spaces: 2 }
      )
    },
  }
}
