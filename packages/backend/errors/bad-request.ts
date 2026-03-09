import { StatusCode } from '../enums'
import { CustomAPIError } from './custom-api'

export class BadRequestError extends CustomAPIError {
  constructor (message: string) {
    super(message, StatusCode.BAD_REQUEST)
  }
}
