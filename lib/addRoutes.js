const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const mockPath = process.env.MOCK_WATCH_PATH
const files = glob.sync(`${mockPath}/**/*.js`)
const apiPath = process.env.MOCK_GATEWAY_PATH

function apiHandler(ctx) {
  const paramKey = process.env.MOCK_GATEWAY_SERVICE_PARAM_NAME
  const serviceName = ctx.query[paramKey] || ctx.body[paramKey]

  const dataFile = files.find(file => {
    return file.match(serviceName) || file.match(serviceName.replace('.', '/'))
  })

  if (!dataFile) {
    ctx.status = 404
  } else {
    ctx.body = require(dataFile)
  }
}

function handleResolvedFile(file, router) {
  const apiAbsPath = path.join(mockPath, apiPath)
  if (file.match(apiAbsPath)) {
    return
  }

  let method = 'get'
  let routePath = ''
  
  // 如果file文件没有通过module.exports或exports导出，res得到的是一个空对象{}，并非是undefined
  let res = require(file)

  const keys = Object.keys(res)
  let fn = ctx => {
    ctx.body = res
  }

  if (!keys.length || !keys[0].match(/(?:POST|GET)\s+\/.*/i)) {
    console.warn(chalk.red(`${file} doesn't comply with mock file format requirements, please see https://github.com/yjh30/koa-mocker-cli`))
    return
  }

  const arr = keys[0].split(' ')
  method = arr[0].toLowerCase()
  routePath = arr[arr.length - 1]

  if (typeof res[keys[0]] !== 'function') {
    const value = res[keys[0]]
    fn = ctx => {
      ctx.body = value
    }
  } else {
    fn = ctx => {
      try {
        res[keys[0]](ctx, {
          json(param) {
            ctx.body = param
          }
        })
      } catch(error) {
        console.log(error)
        console.log(chalk.red(error))
      }
    }
  }

  router[method](routePath, fn)
}

module.exports = function(router) {
  router.get(apiPath, apiHandler)
  router.post(apiPath, apiHandler)

  files.forEach(file => {
    // 避免单个mock数据模块出错导致进程退出
    try {
      handleResolvedFile(file, router)
    } catch (error) {
      console.log(`mock数据文件出错：${chalk.red(error)}`) // 打印重点错误信息
      console.log(error) // 打印错误堆栈
    }
  })
}
