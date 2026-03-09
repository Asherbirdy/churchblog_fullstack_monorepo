import { StatusCode } from '../enums'

export class CustomAPIError extends Error {
  statusCode: StatusCode
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}
