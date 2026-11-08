/**
 *
 * A drawing machine where your nose is the pen, and opening your mouth puts
 * the pen down. Close your mouth to move around without drawing.
 * The dot on the small mirror shows where your pen is.
 *   spacebar - clear the canvas
 *
 * A gesture is just a measurement of the distance between two points:
 *   keypoints[13] is the middle of your top lip
 *   keypoints[14] is the middle of your bottom lip
 * When those two points are far apart, your mouth is open. That gives us
 * true or false, so it can do the job that mouseIsPressed did before.
 *
 * Start with ../simple_face_nose_pen if keypoints are new to you.
 *
 */
let vid;
let faceMesh;
let faces = [];

// This is a percentage of your face's height, not pixels, so the gesture
// works the same whether you are close to the camera or far away.
// Watch the number in the small mirror and change this to suit your mouth.
let mouthOpenAmount = 0.08;

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
    let face = faces[0];
    let nose = face.keypoints[1];
    let topLip = face.keypoints[13];
    let bottomLip = face.keypoints[14];

    let mouthOpen = dist(topLip.x, topLip.y, bottomLip.x, bottomLip.y) / face.faceOval.height;

    if (mouthOpen > mouthOpenAmount) {
      circle(nose.x, nose.y, 30);
    }

    // the mirror is 1/4 the size of the canvas, so divide by 4 to fit
    circle(nose.x / 4, nose.y / 4, 8);

    fill(255);
    textSize(14);
    text('mouth: ' + nf(mouthOpen, 1, 2), 6, 114);
  }
}

function gotFaces(results) {
  faces = results;
}

function keyPressed() {
  if (keyCode === 32) { // Check if the spacebar is pressed
    background(220);
  }
}

// Exercises for you to try :
// 1. Swap the gesture: draw when your mouth is closed, and stop when it's open.
// 2. Use a different pair of points for your gesture. Hint: use
//    ../simple_face_nose_pen to find the numbers you want.
