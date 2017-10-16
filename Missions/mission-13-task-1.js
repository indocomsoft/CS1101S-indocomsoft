// Source EV3
// Specs in Mission 13

// Task 1
// Group name: ¯\_(ツ)_/¯
// Group members: Julius, Guowei, Gan, James

#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

var speed = 65;
var time = 2400;

ev3.runForTime(ev3.motorB(), time, speed);
ev3.runForTime(ev3.motorC(), time, speed);