/* eslint-disable no-console */
import dotenv from 'dotenv'

dotenv.config()
import http from 'http'
import { execSync } from 'child_process'
import cron from 'node-cron'
import path from 'path'

// dist/server.js → dist/ → cron/ → packages/ → monorepo root
const deployTime = '38 9 * * *' 
const ROOT_DIR = path.resolve(__dirname, '../../..')

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cron Server</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .container {
      text-align: center;
      color: white;
    }
    h1 {
      font-size: 4rem;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    p {
      font-size: 1.5rem;
      margin-top: 1rem;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Cron Server</h1>
    <p>排程任務伺服器運行中</p>
  </div>
</body>
</html>
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
