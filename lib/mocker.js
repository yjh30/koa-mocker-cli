#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const program = require('commander')
const chalk = require('chalk')
const start = require('./start')

program
  .version(require('../package.json').version)
  .description('a tool to mock data server')
  .usage('<command> [options]')
  .option('--port <port>', 'default port is 3000')
  .option('--watch <path>', 'directory to listen to')
  .option('--gatewayPath <gatewayPath>', 'default requested gateway address is /api')
  .option('--gatewayServiceParamName <gatewayServiceParamName>', 'default requested gateway service param name is serviceName')
  .parse(process.argv)

const watchPath = path.join(process.cwd(), program.watch)
if (!fs.existsSync(watchPath)) {
  console.log(chalk.red(`mock server: the watch path doesn't exist`))
  process.exit(1)
}

process.env.MOCK_PORT = program.port || 3000
process.env.MOCK_WATCH_PATH = watchPath
process.env.MOCK_GATEWAY_PATH = program.gatewayPath || '/api'
process.env.MOCK_GATEWAY_SERVICE_PARAM_NAME = program.gatewayServiceParamName || 'serviceName'

start()
