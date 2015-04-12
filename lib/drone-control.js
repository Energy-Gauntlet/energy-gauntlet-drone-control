var ws    = require('./socket');
var drone = require('./drone');

fs.readdirSync(path.join(__dirname, 'commands')).forEach(function(p) {
  var basename = p.replace(/\.(coffee|js)/g, '');
  basename     = basename.replace(/-/, '_');
  GLOBAL[basename] = require('./commands/' + basename)(drone);
});

ws.onerror = function() {
  land();
};

ws.onclose = function() {
  land();
};

ws.onmessage = function(event) {
  var raw = event.data;
  console.log(raw)
};
