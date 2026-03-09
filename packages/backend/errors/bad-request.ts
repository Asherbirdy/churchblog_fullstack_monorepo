import { StatusCode } from '@monorepo/libs'
import { CustomAPIError } from './custom-api'

export class BadRequestError extends CustomAPIError {
  constructor (message: string) {
    super(message, StatusCode.BAD_REQUEST)
  }
}
