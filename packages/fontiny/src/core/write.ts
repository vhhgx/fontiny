import path from 'node:path'
import fs from 'fs-extra'
import type { FontinyAsset, FontinyFileResult } from './asset.js'

export const outputRelativeDir = (asset: FontinyAsset) => {
  const dir = path.dirname(asset.relativePath)
  return dir === '.' ? '' : dir
}

export const outputPathFor = (outputDir: string, asset: FontinyAsset, filename: string) => {
  return path.join(outputDir, outputRelativeDir(asset), filename)
}

export async function writeAssetOutputs(
  outputDir: string,
  asset: FontinyAsset
): Promise<FontinyFileResult> {
  const outputs: string[] = []
  const outputDetails: FontinyFileResult['outputDetails'] = []

  for (const output of asset.outputs.values()) {
    const targetPath = outputPathFor(outputDir, asset, output.filename)
    await fs.ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, output.contents)
    outputs.push(targetPath)
    outputDetails.push({
      path: targetPath,
      size: Buffer.isBuffer(output.contents)
        ? output.contents.length
        : Buffer.byteLength(output.contents),
      format: output.kind,
    })
  }

  return {
    input: asset.inputPath,
    originalSize: asset.originalBuffer.length,
    outputs,
    outputDetails,
  }
}
