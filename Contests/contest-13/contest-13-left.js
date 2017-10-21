#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

// Needs calibration
var maxSpeed = 800;
var timeStep = 50; // in ms; used in runForTime()
// Time required to turn 90 degrees
var time90deg = 3500;
// Threshold to determine if a motor running at maxSpeed is pushing something
var pushingThreshold = maxSpeed * 0.65;
// Threshold to determine what value of getColor() is regarded as dangerous
var dangerThreshold = 5;
// Threshold to determine max distance of object to be recognised as an enemy
var eyesThreshold = 50; // in cm
// Threshold to determine when to start turning in the other direction during search
var searchStopThreshold = 0.2; // as a fraction of maxSpeed

// Sensors and Motor objects
var leftMotor = ev3.motorB();
var rightMotor = ev3.motorC();
var eyes = ev3.ultrasonicSensor();
var gyro = ev3.gyroSensor();
var colorSensor = ev3.colorSensor();

// ---- Miscellaneous functions ----
// abs not required as Math object is available in node.js
/*
function abs(val){
    return val < 0 ? -val : val;
}
*/
function not(direction) {
    return direction === "left" ? "right" : "left";
}

function turn(direction, time) {
    if (direction === "left") {
        ev3.runForTime(leftMotor, time, -maxSpeed);
        ev3.runForTime(rightMotor, time, maxSpeed);
    } else {
        ev3.runForTime(leftMotor, time, maxSpeed);
        ev3.runForTime(rightMotor, time, -maxSpeed);
    } 
}

function escapeturn(direction, time) {
    if (direction === "left") {
        ev3.runForTime(leftMotor, time, -maxSpeed);
        ev3.runForTime(rightMotor, time, 0.5 * maxSpeed);
    } else {
        ev3.runForTime(leftMotor, time, 0.5 * maxSpeed);
        ev3.runForTime(rightMotor, time, -maxSpeed);
    } 
}

// ---- End of miscellaneous functions ----
//
// ---- State variables ----
var nextState = init_state;
var lastSearch = undefined;
var leftMotorLast = undefined;
var rightMotorLast = undefined;
var firstTime = undefined;
var secondTime = undefined;
var goingBackward = undefined;
// ---- End of state variables ----

// ---- Status check functions ----
// Return value 0 to 5, the higher the return value, the higher the chance of
// getting kicked out of the arena
function getColor() {
    var code = -1;

    var r = ev3.colorSensorRed(colorSensor);
    var g = ev3.colorSensorGreen(colorSensor);
    var b = ev3.colorSensorBlue(colorSensor);
    if (r <= 200) {
        if (b <= 120) {
            code = 3;
        } else if (b <= 200) {
            code = 1;
        } else {
            code = 2;
        }
    } else if (r <= 350) {
        if (b <= 100) {
            code = 5;
        } else {
            code = 0;
        }
    } else {
        code = 4;
    }
    return code;
}

function inDangerZone() {
    return getColor() >= dangerThreshold;
}

function enemyAhead() {
    return ev3.ultrasonicSensorDistance(eyes) <= eyesThreshold;
}

function updateStats(){

}

// ---- End of status check functions ----



// ---- States ----
function searchAttack() {
    if (prevState !== "searchAttack") {
        prevState = "searchAttack";
        firstTime = true;
    } else { }
    // Rotate if motor is not already running
    if (Math.abs(ev3.motorGetSpeed(leftMotor)) < searchStopThreshold * maxSpeed) {
        if (firstTime) {
            // First call of search
            turn(lastSearch, 1100);
            firstTime = false;
            secondTime = true;
        } else if (secondTime) {
            // Second call of search
            lastSearch = not(lastSearch);
            turn(lastSearch, 2200);
            secondTime = false;
        } else {
            nextState = search;
        }
    }
    if(enemyAhead()){
        nextState = attackFront;
    } else if(inDangerZone()){
        nextState = escape;
    }
}

function search(){
    if(prevState !== "search"){
        prevState = "search";
    } else{ /* Do nothing */}
    // Rotate if motor is not already running
    turn(lastSearch, time90deg * 4);

    if(enemyAhead()){
        nextState = attackFront;
    } else if(inDangerZone()){
        nextState = escape;
    }
}

function attackFront(){
    // Run for 500ms for smooth ride
    ev3.runForTime(leftMotor, 500, maxSpeed);
    ev3.runForTime(rightMotor, 500, maxSpeed);

    if(prevState !== "attackFront"){
        prevState = "attackFront";
    } else{ /* Do nothing */}

    // --- Transition code ---
    if(inDangerZone()){
        // Killed an enemy? Or sensed someone's leg; anyway, about to move out
        // of arena. Escape.
        nextState = escape;
    } else if(!enemyAhead()){
        // Lost the enemy? Chase again
        nextState = searchAttack;
    } else { /* Do nothing, continue attacking */}
}

function escape(){
    // Just asked to escape? Stop moving first
    if(prevState !== "escape"){
        ev3.motorSetStopAction(leftMotor, "hold");
        ev3.motorSetStopAction(rightMotor, "hold");
        ev3.motorStop(leftMotor);
        ev3.motorStop(rightMotor);
        prevState = "escape";
        goingBackward = true;
    } else{ /* Do nothing */ }
        
    if (goingBackward) {
        ev3.runForTime(leftMotor, 1000, -maxSpeed);
        ev3.runForTime(rightMotor, 1000, -maxSpeed);
    }
    // ev3.runForTime(leftMotor, 500, -maxSpeed);
    // ev3.runForTime(rightMotor, 500, -maxSpeed);
        

    // --- Transition code ---
    if(getColor() <= dangerThreshold - 1){
        if (goingBackward) {
            ev3.motorStop(leftMotor);
            ev3.motorStop(rightMotor);
            goingBackward = false;
            turn(lastSearch, time90deg);
        } else {
            ev3.motorStop(leftMotor);
            ev3.motorStop(rightMotor);
            nextState = search;
        }
    } else {
        turn(lastSearch, time90deg);
    }
}

// Initial state after button press.
function init_state(){
    // Always hold the ground
    ev3.motorSetStopAction(leftMotor, "hold");
    ev3.motorSetStopAction(rightMotor, "hold");
    // Very general scenario: directly search
    lastSearch = "left";
    prevState = "search";
    nextState = search;
    /*
    // Scenario 1: head-on →←
    prevState = "attackFront";
    nextState = attackFront;
    */
    
    /*
    // Scenario 2: parallel and facing same direction ↑↑

    */

    /*
    // Scenario 3: facing away from each other ←→
    */
}
// ---- End of states ----


// The main event loop for the finite state machine
source.alert("Ready");
ev3.waitForButtonPress();
while(true){
    updateStats();
    // Execute the state
    nextState();
}
