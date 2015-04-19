var ws      = require('./socket');
var drone   = require('./drone');

require('./commands')(drone);

var right_flex0_low  = 1500;
var right_flex0_high = 1900;

var right_flex1_low  = 1700;
var right_flex1_high = 2100;

var left_flex0_low  = 1400;
var left_flex0_high = 1900;

var left_flex1_low  = 1400;
var left_flex1_high = 1900;

var right_x_low     = 1600;
var right_x_high    = 2800;

var right_y_low     = 1200;
var right_y_high    = 3000;

var flying = false;
var takeoffOrLand = function() {
  if (flying) land();
  else        takeoff();
  flying = !flying;
};

ws.onerror = function() {
  land();
};

ws.onclose = function() {
  land();
};

var fixRanges = function(flex, low, hi) {
  var flex = (function() {
    if (flex === undefined) return undefined;
    if (flex > hi) {
      return hi;
    } else if (flex < low) {
      return low;
    }
    return flex;
  })();
  return 1 - (flex - low) / (hi - low);
};

ws.onmessage = function(event) {
  stop();

  var raw    = JSON.parse(event.data);
  // console.log(raw)
  var sparks = raw.sparks;
  var right  = sparks.right;
  var left   = sparks.left;

  if (right.button_0 > 0) {
    takeoffOrLand();
    disable_emergency();
  }

  var rFlex0 = fixRanges(right.flex_0, right_flex0_low, right_flex0_high);
  var rFlex1 = fixRanges(right.flex_1, right_flex1_low, right_flex1_high);

  var lFlex0 = fixRanges(left.flex_0, left_flex0_low, left_flex0_high);
  var lFlex1 = fixRanges(left.flex_1, left_flex1_low, left_flex1_high);

  var rx     = fixRanges(right.x, right_x_low, right_x_high) - 0.5;
  var ry     = fixRanges(right.y, right_y_low, right_y_high) - 0.5;

  if (Math.abs(rx) > 0.3) {
    if (rx > 0) {
      up(rx * 0.2);
    } else {
      down(rx * 0.2);
    }
  }

  if (Math.abs(ry) > 0.3) {
    if (ry > 0) {
      strafe_right(ry * 0.2);
    } else {
      strafe_left(ry * 0.2);
    }
  }

  var m1 = rFlex0 / (rFlex0 + rFlex1);
  var m2 = rFlex1 / (rFlex0 + rFlex1);

  var turn  = m2 * 2 - 1;
  var speed = Math.max(m1, m2);

  if (speed == 1 && turn == -1) {
    return;
  }

  if (speed > 0.3) {
    forward(0.2 * speed);
  }

  if (Math.abs(turn) > 0.3) {
    if (turn > 0) {
      counter_clockwise(turn * 0.6);
    } else {
      clockwise(turn * 0.6);
    }
  }
};
