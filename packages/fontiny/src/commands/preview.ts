import http from 'node:http'
import path from 'node:path'
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

async function createHtml(outputDir: string, text: string) {
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
      // Skip unreadable preview candidates.
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
  <p class="meta">${relative} · ${info.format} · ${formatBytes(info.size)} · ${info.glyphs} glyphs · ${info.unicodeCount} unicodes</p>
  <div class="sample" style="font-family: 'fontiny-preview-${index}', sans-serif">${escapeHtml(text)}</div>
  <div class="fallback">${escapeHtml(text)}</div>
</section>`)
    .join('\n')

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fontiny Preview</title>
  <style>
${faces}
body { margin: 0; font-family: system-ui, sans-serif; color: #1f2937; background: #f8fafc; }
main { max-width: 1080px; margin: 0 auto; padding: 32px; }
h1 { margin: 0 0 8px; font-size: 28px; }
section { margin-top: 24px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; }
h2 { margin: 0 0 8px; font-size: 18px; }
.meta { margin: 0 0 16px; color: #64748b; font-size: 13px; }
.sample, .fallback { padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 42px; line-height: 1.4; }
.fallback { margin-top: 10px; font-family: system-ui, sans-serif; color: #64748b; }
  </style>
</head>
<body>
  <main>
    <h1>Fontiny Preview</h1>
    <p>${infos.length} font file(s) found in ${escapeHtml(outputDir)}</p>
    ${cards || '<p>No readable font files found.</p>'}
  </main>
</body>
</html>`
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
      if (!filePath.startsWith(outputDir) || !(await fs.pathExists(filePath))) {
        res.writeHead(404)
        res.end('Not found')
        return
      }

      res.writeHead(200, {
        'content-type': mimeTypes[path.extname(filePath)] ?? 'application/octet-stream',
      })
      fs.createReadStream(filePath).pipe(res)
    } catch (error) {
      res.writeHead(500)
      res.end(error instanceof Error ? error.message : String(error))
    }
  })

  await new Promise<void>((resolve) => server.listen(port, resolve))
  const url = `http://localhost:${port}`
  console.log(`Fontiny preview running at ${url}`)

  if (options.open !== false) {
    openUrl(url)
  }
}
