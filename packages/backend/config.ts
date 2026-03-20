import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ process.env.NODE_ENV || 'prod' }`) })

export default {
  port: process.env.PORT || '8000',
  environment: process.env.ENVIRONMENT as 'DEV' | 'PROD',
  database_url: process.env.DATABASE_URL,
  auth_token: process.env.AUTH_TOKEN as 'HEADER' | 'COOKIES',
  email_service_user: process.env.EMAIL_SERVICE_USER,
  email_service_pass: process.env.EMAIL_SERVICE_PASS,
  cors_origin: process.env.CORS_ORIGIN || '*'
  // jwt_secret: process.env.JWT_SECRET
}