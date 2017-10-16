// Source EV3
// Specs in Mission 13

// Task 3
// Group name: ¯\_(ツ)_/¯
// Group members: Julius, Guowei, Gan, James

#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

function walk_straight(){
    ev3.runForTime(ev3.motorB(), 50, 100);
    ev3.runForTime(ev3.motorC(), 50, 100);
}
function turn_left(){
    ev3.runForTime(ev3.motorB(), 50, 50);
    ev3.runForTime(ev3.motorC(), 50, -50);
}
function stop(){
    ev3.stop(ev3.motorB());
    ev3.stop(ev3.motorC());
}
function edge(){
    ev3.runUntil(function(){
                    return ev3.reflectedLightIntensity(ev3.colorSensor()) < 30;
                 }, walk_straight);
    stop();
    ev3.runUntil(function(){
                    return ev3.reflectedLightIntensity(ev3.colorSensor()) > 70;
                 }, turn_left);
    stop();
    edge();
}
edge();