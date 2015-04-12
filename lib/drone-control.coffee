ws    = require './socket'
drone = require './drone'

fs.readdirSync(path.join(__dirname, 'commands')).forEach (p) ->
  basename = p.replace /\.(coffee|js)/g, ''
  basename = basename.replace /-/, '_'
  GLOBAL[basename] = require("./commands/#{basename}")(drone)

ws.on 'message', (data) ->
  # figure out to do with the data
