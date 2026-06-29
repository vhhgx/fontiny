export class FontinyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FontinyError'
  }
}

export const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}
