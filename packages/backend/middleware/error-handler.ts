import { StatusCode } from '../enums'
import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'

interface CustomError extends Error {
  statusCode?: number
}

export const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  // eslint-disable-next-line no-console
  console.error(err)

  const customError = {
    statusCode: err.statusCode || StatusCode.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      customError.msg = `Duplicate value entered for ${ (err.meta?.target as string[])?.join(', ') || 'unknown' } field(s)`
      customError.statusCode = StatusCode.BAD_REQUEST
    }
    if (err.code === 'P2025') {
      customError.msg = 'Record not found'
      customError.statusCode = StatusCode.NOT_FOUND
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    customError.msg = 'Invalid data provided'
    customError.statusCode = StatusCode.BAD_REQUEST
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    customError.msg = '服務暫時無法使用，請稍後再試'
    customError.statusCode = StatusCode.INTERNAL_SERVER_ERROR
  }

  return res.status(customError.statusCode).json({
    success: false,
    error: customError.msg
  })
}
