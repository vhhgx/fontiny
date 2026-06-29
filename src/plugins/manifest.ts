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
        outputs: [...asset.outputs.values()].map((output) =>
          ctx.resolveOutputPath(asset, output.filename)
        ),
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
