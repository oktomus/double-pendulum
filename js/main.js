// https://www.myphysicslab.com/pendulum/double-pendulum-en.html
// https://youtu.be/d0Z8wLLPNE0

var canvas, context;
var time;
var deltaTime;

var DEG2RAD = Math.PI / 180.0;

//
// 2D Points.
//

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Rotate a given point (x, y) around a given pivot (px, py).
 */
function rotate(pivot, pt, angle) {
    var radians = DEG2RAD * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (pt.x - pivot.x)) + (sin * (pt.y - pivot.y)) + pivot.x,
        ny = (cos * (pt.y - pivot.y)) - (sin * (pt.x - pivot.x)) + pivot.y;
    return new Point(nx, ny);
}


//
// Pendulumn.
//

// Relative horizontal and vertical position based on the screen width.
var PENDULUMN_HORIZONTAL_POS = 0.5;
var PENDULUMN_VERTICAL_POS = 0.5;

// Relative length of the pendulumn.
var PENDULUMN_FIRST_LENGTH = 0.1;
var PENDULUMN_SECOND_LENGTH = 0.1;

// Absolute width of the pendulumn.
var PENDULUMN_STROKE_WIDTH = 10;

// Current state and position of the pendulumn.
var pendulumn = {
    pos             : new Point(0, 0),
    secondPos       : new Point(0, 0),
    lastPos         : new Point(0, 0),
    firstAngle      : 270.0,
    secondAngle     : 0.0,
};

/**
 * Compute pendulumn joint positions using angles.
 */
function computePendulumn()
{

    //      pos                             secondPos
    //     /                               /
    //     O===============================O
    //         PENDULUMN_FIRST_LENGTH      ‖
    //                                     ‖ PENDULUMN_SECOND_LENGTH
    //                                     ‖
    //                                     O
    //                                      \
    //                                       lastPos
    //
    //  pos should be static and modified only when the window is resized.
    //  Each O is a joint.

    // Compute secondPos.
    pendulumn.secondPos.x = pendulumn.pos.x + canvas.height * PENDULUMN_FIRST_LENGTH;
    pendulumn.secondPos.y = pendulumn.pos.y;
    pendulumn.secondPos = rotate(pendulumn.pos, pendulumn.secondPos, pendulumn.firstAngle);

    // Compute lastPos.
    pendulumn.lastPos.x = pendulumn.secondPos.x + canvas.height * PENDULUMN_SECOND_LENGTH;
    pendulumn.lastPos.y = pendulumn.secondPos.y;
    pendulumn.lastPos = rotate(pendulumn.secondPos, pendulumn.lastPos, pendulumn.secondAngle);

    pendulumn.firstAngle += deltaTime * 0.1;
    pendulumn.secondAngle += deltaTime * 0.05;
}


//
// Drawing and update functions.
//

function drawPendulumn()
{
    context.beginPath();
    context.lineWidth = PENDULUMN_STROKE_WIDTH;
    context.lineCap = "round";
    context.moveTo(pendulumn.pos.x, pendulumn.pos.y);
    context.lineTo(pendulumn.secondPos.x, pendulumn.secondPos.y);
    context.moveTo(pendulumn.secondPos.x, pendulumn.secondPos.y);
    context.lineTo(pendulumn.lastPos.x, pendulumn.lastPos.y);
    context.stroke();
}

/*
 * Do the actual rendering.
 */
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    /*
    context.moveTo(0,0);
    context.lineTo(canvas.width, canvas.height);
    context.stroke();

    context.beginPath();
    context.arc(
        600 + Math.sin(time * 0.001) * 100,
        300,// + Math.cos(time + 1.0) * 60,
        10,
        0,
        2 * Math.PI);
    context.stroke();
    */

    drawPendulumn();
}

/*
 * Called every frame.
 */
function frameStep(timeStamp)
{
    // Update state variables.
    deltaTime = timeStamp - time;
    time += deltaTime;
    computePendulumn();

    // Draw.
    drawFrame();

    // Ask for another frame.
    window.requestAnimationFrame(frameStep);
}

/**
 * Resize the canvas when the browser is resized.
 * Update the pendulumn position.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pendulumn.pos.x = canvas.width * PENDULUMN_HORIZONTAL_POS;
    pendulumn.pos.y = canvas.height * PENDULUMN_VERTICAL_POS;
}


//
// Initialization functions.
//

/**
 * Listen for window size changes.
 */
function hookEvents()
{
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
}


//
// Starting point.
//

/**
 * Main.
 */
function main()
{
    // Init variables.
    {
        canvas      = document.getElementById('mainCanvas');
        context     = canvas.getContext('2d');
        time        = 0.0;
        lastTime    = 0.0;
        deltaTime   = 0.0;
    }

    hookEvents();
    resizeCanvas();

    // Start rendering.
    window.requestAnimationFrame(frameStep);
}

(function() {
    main();
})();

