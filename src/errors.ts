/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
  body: any

  response: Response

  statusCode: number

  constructor(response: Response, body: any) {
    const statusCode = response.status
    super(`Request failed with status code ${statusCode}`)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.response = body
    this.body = body
    if (!Error.captureStackTrace) this.stack = new Error().stack
    else Error.captureStackTrace(this, this.constructor)
  }
}
