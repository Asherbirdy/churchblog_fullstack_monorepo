import { StatusCode } from '../enum'
import { CustomAPIError } from './custom-api'

export class ForbiddenError extends CustomAPIError {
  constructor (message: string) {
    super(message, StatusCode.FORBIDDEN)
  }
}
