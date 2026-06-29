import { Font, woff2 } from 'fonteditor-core'
import type { FontinyFormat } from './asset.js'

let woff2Ready: Promise<void> | null = null

export async function ensureWoff2() {
  if (!woff2Ready) {
    woff2Ready = Promise.resolve(woff2.init()).then(() => undefined)
  }

  return woff2Ready
}

export async function createFont(buffer: Buffer, type: FontinyFormat, options = {}) {
  if (type === 'woff2') {
    await ensureWoff2()
  }

  return Font.create(buffer, {
    type,
    ...options,
  })
}

export async function writeFont(
  buffer: Buffer,
  inputType: FontinyFormat,
  outputType: FontinyFormat,
  options = {}
) {
  if (inputType === 'woff2' || outputType === 'woff2') {
    await ensureWoff2()
  }

  const font = await createFont(buffer, inputType, options)
  return Buffer.from(
    font.write({
      type: outputType,
      toBuffer: true,
      ...options,
    })
  )
}
