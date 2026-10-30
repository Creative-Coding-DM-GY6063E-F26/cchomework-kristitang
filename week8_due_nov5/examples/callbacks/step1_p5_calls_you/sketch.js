/**
 *
 * STEP 1: p5 calls you.
 *
 * A callback is a function you write so that SOMEONE ELSE can call it later.
 * You've been writing them since week 1: setup(), draw(), mousePressed()...
 *
 * Note: nowhere in this file do we write draw() or mousePressed()
 * to run them. p5 finds functions with these exact names and calls them
 * at the right moment.
 *
 *   click - count a click
 *
 */
let clicks = 0;

// p5 calls this ONCE, when the sketch starts
function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(24);
}

// p5 calls this about 60 times every second
function draw() {
  background(220);
  text('draw() calls: ' + frameCount, width / 2, height / 2 - 20);
  text('mousePressed() calls: ' + clicks, width / 2, height / 2 + 20);
}

// p5 calls this every time the mouse button goes down
function mousePressed() {//this is specific callback function in p5
  clicks++;
}

// Try it: rename mousePressed to mouseClicked, or to mousepressed (lowercase).
// What happens? p5 only calls the names it knows about.
