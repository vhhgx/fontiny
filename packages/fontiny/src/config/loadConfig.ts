import path from 'node:path'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'
import { fontinyConfigSchema, type FontinyConfig } from './schema.js'

const defaultConfigFiles = ['fontiny.config.js', 'fontiny.config.mjs']

export async function loadConfig(configPath?: string): Promise<FontinyConfig> {
  const cwd = process.cwd()
  const candidates = configPath
    ? [path.resolve(cwd, configPath)]
    : defaultConfigFiles.map((file) => path.resolve(cwd, file))

  const resolved = candidates.find((file) => fs.existsSync(file))
  if (!resolved) {
    return {}
  }

  const imported = await import(`${pathToFileURL(resolved).href}?t=${Date.now()}`)
  const rawConfig = imported.default ?? imported.config ?? imported
  return fontinyConfigSchema.parse(rawConfig)
}
