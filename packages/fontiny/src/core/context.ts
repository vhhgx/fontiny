import type { FontinyAsset, FontinyFileResult, FontinyRunError } from './asset.js'

export type FontinyContext = {
  cwd: string
  outputDir: string
  warnings: string[]
  errors: FontinyRunError[]
  files: FontinyFileResult[]
  shared: Map<string, unknown>
  resolveOutputPath(asset: FontinyAsset, filename: string): string
}

export type FontinyPlugin = {
  name: string
  transform?: (asset: FontinyAsset, ctx: FontinyContext) => Promise<void> | void
  afterAll?: (assets: FontinyAsset[], ctx: FontinyContext) => Promise<void> | void
}
