/**
 *
 * STEP 1: the erasing problem.
 *
 * The moving circle stands in for the webcam video in hand_gestures.
 * Anything that moves needs background() every frame to erase its old position.
 * But background() erases everything else too, including our line.
 *
 *   drag the mouse - try to draw a line
 *
 */
let circleX = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220); // wipes the whole canvas, 60 times a second

  noStroke();
  fill('steelblue');
  circle(circleX, height / 2, 100);
  circleX = (circleX + 2) % width; // wrap back to 0 at the right edge

  if (mouseIsPressed) {
    stroke('tomato');
    strokeWeight(8);
    // this only lasts one frame, until background() wipes it away
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

// Try it: comment out background(220) and draw again.
// The line stays now, but what happens to the circle?
