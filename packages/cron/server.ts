/* eslint-disable no-console */
import dotenv from 'dotenv'

dotenv.config()
import http from 'http'
import { execSync } from 'child_process'
import cron from 'node-cron'
import path from 'path'

// dist/server.js → dist/ → cron/ → packages/ → monorepo root
const deployTime = '13 10 * * *'
const ROOT_DIR = path.resolve(__dirname, '../../..')
const BACKEND_API = process.env.BACKEND_API || 'http://localhost:1210'

interface BeforeBuildResponse {
  msg: string
  online: number
  offline: number
}

async function shouldBuild (): Promise<boolean> {
  try {
    const res = await fetch(`${ BACKEND_API }/api/v1/page/before-build-and-deploy`)
    const data = await res.json() as BeforeBuildResponse
    const total = data.online + data.offline
    console.log(`before-build-and-deploy: online=${ data.online }, offline=${ data.offline }, total=${ total }`)
    return total > 0
  } catch (error) {
    console.error('無法取得 before-build-and-deploy 資訊：', error)
    return false
  }
}

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
cron.schedule(deployTime, async () => {
  if (!process.env.DIST_TARGET || !process.env.FRONTEND_OUTPUT) {
    console.error('DIST_TARGET 或 FRONTEND_OUTPUT 未設定')
    return
  }

  const needBuild = await shouldBuild()
  if (!needBuild) {
    console.log('沒有需要打包的頁面，跳過本次部署')
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

    console.log('開始 git push...')
    const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    execSync('git add .', { cwd: DIST_TARGET, stdio: 'inherit' })
    execSync(`git commit -m "${ now }"`, { cwd: DIST_TARGET, stdio: 'inherit' })
    execSync('git push', { cwd: DIST_TARGET, stdio: 'inherit' })
    console.log('部署完成')
  } catch (error) {
    console.error('frontend build 或部署失敗：', error)
  }
}, { timezone: 'Asia/Taipei' })

server.listen(PORT, () => {
  console.table({
    PORT,
    BACKEND_API,
    DIST_TARGET: process.env.DIST_TARGET || '(未設定)',
    FRONTEND_OUTPUT: process.env.FRONTEND_OUTPUT || '(未設定)',
    deployTime,
  })
  console.log(`伺服器運行於 http://localhost:${ PORT }`)
})
