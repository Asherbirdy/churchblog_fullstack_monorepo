/* eslint-disable no-console */
import dotenv from 'dotenv'

dotenv.config()
import http from 'http'
import { execSync } from 'child_process'
import cron from 'node-cron'
import path from 'path'

// dist/server.js → dist/ → cron/ → packages/ → monorepo root
const deployTime = '1 10 * * *' 
const ROOT_DIR = path.resolve(__dirname, '../../..')

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`
      <h1>Cron Server</h1>
      <p>排程任務伺服器運行中</p>
    `)
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('404 Not Found')
  }
})

// 每天晚上九點 (21:00)
cron.schedule(deployTime, () => {
  if(!process.env.DIST_TARGET || !process.env.FRONTEND_OUTPUT) {
    console.error('DIST_TARGET 或 FRONTEND_OUTPUT 未設定')
    return
  }
  const DIST_TARGET = process.env.DIST_TARGET
  const FRONTEND_OUTPUT = path.join(ROOT_DIR, process.env.FRONTEND_OUTPUT)

  try {
    console.log('開始執行 frontend build...')
    execSync('pnpm run -C packages/frontend build', { cwd: ROOT_DIR, stdio: 'inherit' })
    console.log('frontend build 完成')

    console.log(`清除 ${ DIST_TARGET } ...`)
    execSync(`rm -rf ${ DIST_TARGET }/*`, { stdio: 'inherit' })

    console.log(`複製 build 檔案至 ${ DIST_TARGET } ...`)
    execSync(`cp -r ${ FRONTEND_OUTPUT }/. ${ DIST_TARGET }/`, { stdio: 'inherit' })
    console.log('部署完成')
  } catch (error) {
    console.error('frontend build 或部署失敗：', error)
  }
}, { timezone: 'Asia/Taipei' })

server.listen(PORT, () => {
  console.log(`Cron job at ${ deployTime }`)
  console.log(`伺服器運行於 http://localhost:${ PORT }`)
})
