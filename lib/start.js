const path = require('path')
const cp = require('child_process')

let timeoutId = null

const start = () => {
  const mock_p = cp.fork(path.join(__dirname, './server.js'))
  mock_p.on('message', msg => {
    if (msg === 'RESTART') {
      mock_p.kill()
      clearTimeout(timeoutId)
      timeoutId = setTimeout(start, 100)
    }
  })
}

module.exports = start
