import path from 'node:path'
import fs from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { getPreviewTemplatePath } from '../src/commands/preview.js'

describe('preview command', () => {
  it('uses a packaged html template', async () => {
    const templatePath = await getPreviewTemplatePath()
    const html = await fs.readFile(templatePath, 'utf8')
    const normalizedPath = templatePath.split(path.sep).join('/')

    expect(normalizedPath).toContain('templates/preview.html')
    expect(html).toContain('{{FONT_CARDS}}')
    expect(html).toContain('Fontiny 字体预览')
  })
})
