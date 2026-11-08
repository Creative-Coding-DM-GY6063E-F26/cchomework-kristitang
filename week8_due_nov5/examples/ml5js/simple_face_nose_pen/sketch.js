/**
 *
 * A simple drawing machine that you draw on with your nose.
 * It's the same idea as ../../simple_drawing_machines, but the ml5.js faceMesh
 * model tells us where to draw instead of the mouse.
 *   spacebar - clear the canvas
 *
 * faceMesh finds 468 points on your face and puts them in an array called
 * keypoints. Each point has a number, and an x and a y. The tip of your nose
 * is number 1, so where we used mouseX and mouseY before, we can now use:
 *   faces[0].keypoints[1].x
 *   faces[0].keypoints[1].y
 *
 */
let vid;
let faceMesh;
let faces = [];

async function setup() {
  // the canvas and video are the same size, so the face's keypoints
  // can be used as canvas positions without any conversion
  createCanvas(640, 480);
  background(220);

  // flipped makes the video act like a mirror
  vid = createCapture(VIDEO, { flipped: true });
  vid.size(width, height);
  vid.hide();

  // faceMesh needs to be flipped too, so the keypoints line up with the video
  faceMesh = await ml5.faceMesh({ maxFaces: 1, flipped: true });
  faceMesh.detectStart(vid, gotFaces);
}

function draw() {
  // a small mirror in the corner, so you can see what the camera sees
  image(vid, 0, 0, 160, 120);

  noStroke();
  fill('tomato');

  // faces is empty when no face is visible
  if (faces.length > 0) {
    let nose = faces[0].keypoints[1];
    circle(nose.x, nose.y, 30);
  }
}

function gotFaces(results) {
  faces = results;
}

function keyPressed() {
  if (keyCode === 32) { // Check if the spacebar is pressed
    background(220); //clear the drawing
  }
}

// Exercises for you to try :
// 1. Change the 1 in keypoints[1] to another number from 0 to 467. Which part
//    of your face is it?
/*
 * FaceMesh Keypoint Index Reference
 * ===================================================
 * FEATURE          LANDMARK            KEYPOINT INDEX
 * ---------------------------------------------------
 * Nose             Nose Tip            4
 *                  Nose Bridge         6
 * ---------------------------------------------------
 * Left Eye         Outer Corner        33
 *                  Inner Corner        133
 *                  Top Eyelid          159
 *                  Bottom Eyelid       145
 * ---------------------------------------------------
 * Right Eye        Outer Corner        263
 *                  Inner Corner        362
 *                  Top Eyelid          386
 *                  Bottom Eyelid       374
 * ---------------------------------------------------
 * Mouth & Lips     Left Corner         61
 *                  Right Corner        291
 *                  Upper Lip (Center)  13
 *                  Lower Lip (Center)  14
 * ---------------------------------------------------
 * Face Frame       Chin                152
 *                  Forehead (Center)   10
 *                  Left Cheek          234
 *                  Right Cheek         454
 * ===================================================
 */

// 2. Draw with two points at once, each with its own color.
// 3. Press 's' to save your drawing as an image with saveCanvas().
