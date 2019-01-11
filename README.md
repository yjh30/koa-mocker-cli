# 吕超英语h5项目总结
- [移动端Vue单页应用 与 大数据埋点最佳实践](./clogger.md)
- 改造[connect-history-api-fallback](https://www.npmjs.com/package/connect-history-api-fallback)，开发[koa-history-api-fallback-middleware](https://github.com/yjh30/koa-history-api-fallback-middleware)
> 1、connect-history-api-fallback并不能用于node服务生产环境；2、使用koa-history-api-fallback-middleware与koa-static一定要注意顺序关系，举个例子（下面代码正常）：
```js
const Koa = require('koa')
const Router = require('koa-router')
const server = new Koa()
const router = new Router()

// 模拟使用koa-history-api-fallback-middleware逻辑
server.use(async (ctx, next) => {
  if (ctx.url === '/aa') {
    ctx.url = '/bb'
  }
  await next()
})

// 模拟使用koa-static中间件逻辑
server.use(async (ctx, next) => {
  if (ctx.url === '/bb') {
    ctx.body = '/aa'
  } else {
    await next()
  }
})

router.get('/a', ctx => {
  ctx.body = ctx.path
})
router.get('/b', ctx => {
  ctx.body = ctx.path
})
router.get('/c', ctx => {
  ctx.body = ctx.path
})

server
  .use(router.routes())
  .use(router.allowedMethods())
server.listen(5002)
```
>如果模拟使用koa-static中间件逻辑代码放在模拟使用koa-history-api-fallback-middleware逻辑上面，那么访问localhost:5002/aa 就404了

- 开发[koa-mocker-cli](https://www.npmjs.com/package/koa-mocker-cli)脚手架工具
> 对process进程uncaughtException事件的重新认识：该事件捕获异步错误，一般如果异步错误耗损cpu及内存，监听该该事件应该尝试退出node进程然后尝试重启服务，如果错误只是简单的如vue ssr同构异步错误，那么为了保证线上其他项目不受影响应该打印错误日志并邮件通知开发，解决错误后重新打包部署服务

