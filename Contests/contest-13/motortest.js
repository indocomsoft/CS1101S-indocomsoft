#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

var leftMotor = ev3.motorB();
var rightMotor = ev3.motorC();
var currSpeed = 0;
function motorTest(){
    ev3.motorSetSpeed(leftMotor, currSpeed);
    ev3.motorSetSpeed(rightMotor, currSpeed);
}
motorTest();
ev3.motorStart(leftMotor);
ev3.motorStart(rightMotor);
for(var i = 0; i < 5; i++){
    currSpeed += 50;
    motorTest();
    ev3.pause(500);
}
