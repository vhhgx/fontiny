import { z } from 'zod'

const formatSchema = z.enum(['ttf', 'otf', 'woff', 'woff2', 'svg'])
const iconfontFormatSchema = z.enum(['ttf', 'woff', 'woff2', 'svg'])

export const fontinyConfigSchema = z
  .object({
    input: z.string().optional(),
    output: z.string().optional(),
    text: z.string().optional(),
    textFile: z.string().optional(),
    unicodes: z.array(z.number()).optional(),
    formats: z.array(formatSchema).optional(),
    engine: z.enum(['builtin', 'fonttools']).optional(),
    css: z.union([z.boolean(), z.record(z.string(), z.unknown())]).optional(),
    manifest: z.union([z.boolean(), z.record(z.string(), z.unknown())]).optional(),
    watch: z.boolean().optional(),
    iconfont: z
      .object({
        input: z.string().optional(),
        output: z.string().optional(),
        name: z.string().optional(),
        formats: z.array(iconfontFormatSchema).optional(),
        css: z.boolean().optional(),
        types: z.boolean().optional(),
        startCodepoint: z.number().optional(),
        codepoints: z.string().optional(),
      })
      .optional(),
  })
  .passthrough()

export type FontinyConfig = z.infer<typeof fontinyConfigSchema>
