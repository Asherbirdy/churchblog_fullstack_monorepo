/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

module.exports = function (plop) {
  plop.setGenerator('package', {
    description: 'Create a new lineOA package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name(英文全小寫，無空格):'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/{{name}}',
        base: 'plop-templates/package',
        templateFiles: 'plop-templates/package/**/*'
      },
      {
        type: 'add',
        path: 'packages/{{name}}/.env.development',
        templateFile: 'plop-templates/package/.env.development'
      },
      {
        type: 'add',
        path: 'packages/{{name}}/.env.production',
        templateFile: 'plop-templates/package/.env.production'
      },
      {
        type: 'add',
        path: 'packages/{{name}}/.gitignore',
        templateFile: 'plop-templates/package/.gitignore'
      },
      {
        type: 'add',
        path: 'docs/{{name}}.txt',
        template: '專案：{{name}}\n官方帳號名稱:\n正式網址:\n測試網址:\n專案簡介:'
      },
      // 新增：更新 run-project.js
      function (data) {
        const runProjectPath = path.join(process.cwd(), 'run-project.js')
        let content = fs.readFileSync(runProjectPath, 'utf8')
        const newProject = `{ name: '${ data.name }', commands: ['dev', 'build'] },\n];`
        content = content.replace(/];/, newProject)
        fs.writeFileSync(runProjectPath, content)
        return 'Updated run-project.js'
      }
    ]
  })
}