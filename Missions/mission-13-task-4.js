// Source EV3
// Specs in Mission 13

// Task 4
// Group name: ¯\_(ツ)_/¯
// Group members: Julius, Guowei, Gan, James

#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

var speed = 100;
var increment = 600;
var color_threshold = 40;
var speed_run = 100;

function turn(direction, time){
    if (direction === "left") {
        ev3.runForTime(ev3.motorB(), time, -speed);
        ev3.runForTime(ev3.motorC(), time, speed);
    } else {
        ev3.runForTime(ev3.motorB(), time, speed);
        ev3.runForTime(ev3.motorC(), time, -speed);
    }
}

function walkstraight(){
    ev3.runForTime(ev3.motorB(), 1000, speed_run);
    ev3.runForTime(ev3.motorC(), 1000, speed_run);
}

function not(direction) {
    return direction === "left" ? "right" : "left";
}

function sweep_condition() {
    return ev3.reflectedLightIntensity(ev3.colorSensor()) < color_threshold
           || ev3.gyroSensorRate(ev3.gyroSensor()) === 0;
}

function sweep(count_left, count_right, do_what) {
    if (count_right >= 4 && count_left >= 4) {
        source.alert("This is the end of the track. Passengers please alight.");
    } else if (count_right === 0 && count_left === 0) {
        turn(do_what, increment);
        ev3.runUntil(sweep_condition, function() { });
        ev3.stop(ev3.motorB());
        ev3.stop(ev3.motorC());
        if (ev3.reflectedLightIntensity(ev3.colorSensor()) < color_threshold) {
            recurring(do_what);
        } else {
            sweep((do_what === "left" ? count_left + 1
                                      : count_left),
                  (do_what === "right" ? count_right + 1
                                       : count_right),
                  not(do_what));
        }
    } else {
        if (do_what === "left") {
            turn(do_what,
                 increment * (count_left + 2) + increment * count_right);
        } else {
            turn(do_what,
                 increment * (count_right + 2) + increment * count_left);
        }
        ev3.runUntil(sweep_condition, function() { });
        ev3.stop(ev3.motorB());
        ev3.stop(ev3.motorC());
        if (ev3.reflectedLightIntensity(ev3.colorSensor()) < color_threshold) {
            recurring(do_what);
        } else {
            sweep((do_what === "left" ? count_left + 2
                                      : count_left),
                  (do_what === "right" ? count_right + 2
                                       : count_right),
                  not(do_what));
        }
    }
}

function walking_condition() {
    return ev3.reflectedLightIntensity(ev3.colorSensor()) >= color_threshold;
}

function recurring(previous_turn) {
    source.alert("Walking straight");
    ev3.runUntil(walking_condition, walkstraight);
    ev3.stop(ev3.motorB());
    ev3.stop(ev3.motorC());
    source.alert("Lost track ");
    sweep(0, 0, previous_turn);
}

recurring("left");