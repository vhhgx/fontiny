import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { inspectFont } from '../core/inspect.js'
import { formatBytes } from '../core/format.js'

type PreviewCommandOptions = {
  text?: string
  port?: string
  open?: boolean
}

const currentDir = path.dirname(fileURLToPath(import.meta.url))

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
}

function openUrl(url: string) {
  const command = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`

  exec(command)
}

export async function getPreviewTemplatePath() {
  const candidates = [
    path.resolve(currentDir, '../templates/preview.html'),
    path.resolve(currentDir, '../../templates/preview.html'),
  ]

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate
    }
  }

  throw new Error('找不到预览模板文件：templates/preview.html')
}

async function loadPreviewTemplate() {
  return fs.readFile(await getPreviewTemplatePath(), 'utf8')
}

function renderTemplate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((html, [key, value]) => {
    return html.replaceAll(`{{${key}}}`, value)
  }, template)
}

async function createHtml(outputDir: string, text: string) {
  const template = await loadPreviewTemplate()
  const fontFiles = await fg('**/*.{ttf,otf,woff,woff2}', {
    cwd: outputDir,
    onlyFiles: true,
  })

  const infos = []
  for (const file of fontFiles) {
    const absolute = path.join(outputDir, file)
    try {
      infos.push({ relative: file, info: await inspectFont(absolute) })
    } catch {
      // 跳过无法读取的预览候选文件。
    }
  }

  const faces = infos
    .map(({ relative, info }, index) => `@font-face {
  font-family: "fontiny-preview-${index}";
  src: url("/${relative.split(path.sep).join('/')}") format("${info.format === 'ttf' || info.format === 'otf' ? 'truetype' : info.format}");
  font-display: swap;
}`)
    .join('\n')

  const cards = infos
    .map(({ relative, info }, index) => `<section>
  <h2>${info.family ?? path.basename(relative)}</h2>
  <p class="meta">${relative} · ${info.format} · ${formatBytes(info.size)} · ${info.glyphs} 个字形 · ${info.unicodeCount} 个 Unicode</p>
  <div class="sample" style="font-family: 'fontiny-preview-${index}', sans-serif">${escapeHtml(text)}</div>
  <div class="fallback">${escapeHtml(text)}</div>
</section>`)
    .join('\n')

  return renderTemplate(template, {
    FONT_FACES: faces,
    OUTPUT_DIR: escapeHtml(outputDir),
    FONT_COUNT: String(infos.length),
    FONT_CARDS: cards || '<p>没有找到可读取的字体文件。</p>',
  })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function runPreviewCommand(input: string, options: PreviewCommandOptions) {
  const outputDir = path.resolve(process.cwd(), input)
  const port = Number(options.port ?? 4173)
  const text = options.text ?? '你好 Fontiny'
  const templatePath = await getPreviewTemplatePath()

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', `http://localhost:${port}`)
      if (url.pathname === '/') {
        const html = await createHtml(outputDir, text)
        res.writeHead(200, { 'content-type': mimeTypes['.html'] })
        res.end(html)
        return
      }

      const filePath = path.resolve(outputDir, `.${decodeURIComponent(url.pathname)}`)
      const relativePath = path.relative(outputDir, filePath)
      const stat = relativePath.startsWith('..') || path.isAbsolute(relativePath)
        ? null
        : await fs.stat(filePath).catch(() => null)
      if (!stat?.isFile()) {
        res.writeHead(404)
        res.end('未找到文件')
        return
      }

      res.writeHead(200, {
        'content-type': mimeTypes[path.extname(filePath)] ?? 'application/octet-stream',
      })
      const stream = fs.createReadStream(filePath)
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500)
        }
        res.end('读取文件失败')
      })
      stream.pipe(res)
    } catch (error) {
      res.writeHead(500)
      res.end(error instanceof Error ? error.message : String(error))
    }
  })

  await new Promise<void>((resolve) => server.listen(port, resolve))
  const url = `http://localhost:${port}`
  console.log(`Fontiny 预览服务已启动：${url}`)
  console.log(`预览 HTML 模板：${path.relative(process.cwd(), templatePath) || templatePath}`)

  if (options.open !== false) {
    openUrl(url)
  }
}
