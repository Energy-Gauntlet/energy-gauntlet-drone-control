module.exports = function(drone) {

  fs.readdirSync(path.join(__dirname, 'commands')).forEach(function(p) {
    var basename = p.replace(/\.(coffee|js)/g, '');
    var cmd_name = basename.replace(/-/, '_');
    GLOBAL[cmd_name] = (function() {
      var fn = require('./commands/' + basename)(drone);
      return function(arg) {
        var args = ['Cmd', basename];
        if (arg) { args.push(arg); }
        console.log.apply(console, args);
        fn(arg);
      };
    })();
  });

};
