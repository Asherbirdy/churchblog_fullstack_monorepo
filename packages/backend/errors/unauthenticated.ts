import { StatusCode } from '../enum'
import { CustomAPIError } from './custom-api'

export class UnauthenticatedError extends CustomAPIError {
  constructor (message: string) {
    super(message, StatusCode.UNAUTHORIZED)
  }
}