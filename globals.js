require('coffee-script/register');

GLOBAL.ROOT = __dirname;

GLOBAL._ = require('lodash');

[

  'fs',
  'path'

].forEach(function(m) { GLOBAL[m] = require(m); })


_.extend(GLOBAL, {
  'config': require('./config/config')
});

GLOBAL.set_timeout = function(time, cb) {
  return setTimeout(cb, time);
}
