import path from 'node:path'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'
import { FontinyError } from '../core/errors.js'
import { fontinyConfigSchema, type FontinyConfig } from './schema.js'

const defaultConfigFiles = ['fontiny.config.js', 'fontiny.config.mjs']

export async function loadConfig(configPath?: string): Promise<FontinyConfig> {
  const cwd = process.cwd()
  const candidates = configPath
    ? [path.resolve(cwd, configPath)]
    : defaultConfigFiles.map((file) => path.resolve(cwd, file))

  const resolved = candidates.find((file) => fs.existsSync(file))
  if (!resolved) {
    if (configPath) {
      throw new FontinyError(`配置文件不存在：${configPath}`)
    }
    return {}
  }

  let imported: Record<string, unknown>
  try {
    imported = await import(`${pathToFileURL(resolved).href}?t=${Date.now()}`)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new FontinyError(
      `无法加载配置文件：${path.relative(cwd, resolved)}\n原因：${reason}\n` +
        '提示：配置文件使用 ESM 语法（export default）。如果当前项目是 CommonJS，' +
        '请将配置文件重命名为 fontiny.config.mjs，或在 package.json 中设置 "type": "module"。'
    )
  }

  const rawConfig = imported.default ?? imported.config ?? imported
  return fontinyConfigSchema.parse(rawConfig)
}
