export type FontinyFormat = 'ttf' | 'otf' | 'woff' | 'woff2' | 'svg'

export type FontinyOutputKind = FontinyFormat | 'css' | 'json'

export type FontinyOutput = {
  kind: FontinyOutputKind
  filename: string
  contents: Buffer | string
}

export type FontinyAsset = {
  inputPath: string
  relativePath: string
  basename: string
  ext: FontinyFormat
  originalBuffer: Buffer
  currentBuffer: Buffer
  currentType: FontinyFormat
  outputs: Map<FontinyOutputKind, FontinyOutput>
  meta: {
    fontFamily?: string
    glyphCount?: number
    subsetText?: string
  }
}

export type FontinyFileResult = {
  input: string
  outputs: string[]
}

export type FontinyRunError = {
  input?: string
  message: string
}

export type FontinyRunResult = {
  files: FontinyFileResult[]
  warnings: string[]
  errors: FontinyRunError[]
}
