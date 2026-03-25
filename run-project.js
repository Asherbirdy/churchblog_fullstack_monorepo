/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process')
const readline = require('readline')
const path = require('path')
const fs = require('fs')

const projects = [
  { name: 'frontend', commands: ['dev', 'build', 'typecheck'] },
  { name: 'backend', commands: [
    'dev',
    'build',
    'deploy', // 正式環境用這個
    'prisma-generate',
    'pm2-deploy',
    'pm2-stop',
    'pm2-delete'
  ] },
  { name: 'chatbot', commands: ['dev', 'build','build-to-frontend'] }
]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('選擇要運行的項目：')
projects.forEach((project, index) => {
  console.log(`${ index + 1 }. ${ project.name }`)
})

rl.question('請輸入項目編號： ', (projectIndex) => {
  const project = projects[ parseInt(projectIndex) - 1 ]
  
  if (!project) {
    console.log('無效的選擇')
    rl.close()
    return
  }

  console.log(`\n選擇 ${ project.name } 的命令：`)
  project.commands.forEach((command, index) => {
    console.log(`${ index + 1 }. ${ command }`)
  })

  rl.question('請輸入命令編號： ', (commandIndex) => {
    const command = project.commands[ parseInt(commandIndex) - 1 ]

    if (!command) {
      console.log('無效的選擇')
      rl.close()
      return
    }

    console.log(`\n運行命令：pnpm run -C packages/${ project.name } ${ command }`)
    try {
      execSync(`pnpm run -C packages/${ project.name } ${ command }`, { stdio: 'inherit' })
      
      if (command === 'build' || command === 'testBuild') {
        const buildPath = path.join(__dirname, 'packages', project.name, 'dist')
        if (fs.existsSync(buildPath)) {
          console.log(`\n打開 build 資料夾：${ buildPath }`)
          switch (process.platform) {
          case 'darwin':
            execSync(`open "${ buildPath }"`)
            break
          case 'win32':
            execSync(`start "" "${ buildPath }"`)
            break
          default:
            execSync(`xdg-open "${ buildPath }"`)
          }
        } else {
          console.log(`\n找不到 build 資料夾：${ buildPath }`)
        }
      }
    } catch (error) {
      console.error('命令執行失敗：', error)
    }

    rl.close()
  })
})