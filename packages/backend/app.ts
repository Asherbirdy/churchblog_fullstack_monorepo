import 'express-async-errors'
import express, { Application } from 'express'
import config from './config'

// Routes
import AuthRoutes from './routes/AuthRoutes'
import UserRoutes from './routes/UserRoutes'
import PageRoutes from './routes/PageRoutes'
import DevRoutes from './routes/DevRoutes'
import AccountRoutes from './routes/AccountRoutes'
import BotRoutes from './routes/BotRoutes'

import cors from 'cors'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import { errorHandlerMiddleware } from './middleware'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import hpp from 'hpp'

class Server {
  private app: Application

  constructor () {
    this.app = express()
    this.middlewares()
    this.routes()
    this.handleErrorAndSafety()
  }

  middlewares () {
    this.app.use(cors({ origin: config.cors_origin }))
    this.app.use(express.json())
    this.app.use(cookieParser(process.env.JWT_SECRET))
    this.app.use(express.static('public'))

    const sensitiveRoutes = ['/api/v1/auth/login', '/api/v1/auth/loginSendOtp']
    this.app.use(
      morgan((tokens, req, res) => {
        const url = tokens.url(req, res) || ''
        const isSensitive = sensitiveRoutes.some((route) => url.startsWith(route))
        return [
          tokens.method(req, res),
          url,
          tokens.status(req, res),
          `${ new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) }`,
          `ips: ${ req.ips }`,
          'payload:', isSensitive ? '[HIDDEN]' : JSON.stringify(req.body),
        ].join(' ')
      }))
    
    this.app.set('trust proxy', 1)
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
      }))

  }

  routes () {
    // ** v1
    this.app.use('/api/v1/auth', AuthRoutes)
    this.app.use('/api/v1/user', UserRoutes)
    this.app.use('/api/v1/page', PageRoutes)
    this.app.use('/api/v1/dev', DevRoutes)
    this.app.use('/api/v1/account', AccountRoutes)
    this.app.use('/api/v1/bot', BotRoutes)
  }

  handleErrorAndSafety () {
    this.app.use(errorHandlerMiddleware)
    this.app.use(helmet())
    this.app.use(hpp())
  }

  listen () {
    this.app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.table(config)
      console.log(`Server up and running at port: ${ config.port }`)
    })
  }
}

export default Server

const server = new Server()

server.listen()
