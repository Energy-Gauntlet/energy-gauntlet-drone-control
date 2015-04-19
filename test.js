require('./globals');

var drone   = require('./lib/drone');

require('./lib/commands')(drone);

takeoff();

setTimeout(land, 1000);
