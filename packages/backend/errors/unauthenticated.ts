import { StatusCode } from '@monorepo/libs'
import { CustomAPIError } from './custom-api'

export class UnauthenticatedError extends CustomAPIError {
  constructor (message: string) {
    super(message, StatusCode.UNAUTHORIZED)
  }
}