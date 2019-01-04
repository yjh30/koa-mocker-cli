const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const chokidar = require('chokidar')

process.on('uncaughtException', error => {
  console.log(error)
})

const server = new Koa()
const router = new Router()
const addRoutes = require('./addRoutes')
server.use(bodyParser())

addRoutes(router)

server
  .use(router.routes())
  .use(router.allowedMethods())

server.listen(process.env.MOCK_PORT)

const watcher = chokidar.watch(process.env.MOCK_WATCH_PATH)
watcher.on('change', path => {
  process.send('RESTART')
})
