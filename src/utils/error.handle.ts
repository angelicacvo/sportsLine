import type { Response } from 'express'

// send a standardized error response with optional detail
export function errorHandler(res: Response, message: string, error?: unknown, status = 500) {
  const detail = error instanceof Error ? error.message : (typeof error === 'string' ? error : undefined)
  if (detail) {
    // console.error(message, detail)
  }
  return res.status(status).json({ message, error: detail })
}
