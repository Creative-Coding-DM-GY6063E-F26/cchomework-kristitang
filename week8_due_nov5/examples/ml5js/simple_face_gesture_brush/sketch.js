/**
 *
 * A drawing machine where your whole face controls the brush:
 *   nose - moves the pen
 *   open your mouth - puts the pen down, and the wider it opens the bigger the brush
 *   tilt your head - changes the color
 *   spacebar - clear the canvas
 *
 * These gestures do the job of the keyboard modifiers in
 * ../../simple_drawing_machines/mouseAndKeyBoardModifiers
 *
 * A head tilt is another measurement between two points:
 *   keypoints[33] is the outside corner of the eye on the left of the canvas
 *   keypoints[263] is the outside corner of the eye on the right of the canvas
 * When your head is straight they have the same y, and when you tilt it one
 * of them gets lower than the other.
 *
 * Start with ../simple_face_mouth_pen if the mouth gesture is new to you.
 *
 */
let vid;
let faceMesh;
let faces = [];

// These are percentages of your face's height, not pixels, so the gestures
// work the same whether you are close to the camera or far away.
// Watch the numbers in the small mirror and change these to suit your face.
let mouthOpenAmount = 0.08; // how far apart your lips need to be
let mouthWideAmount = 0.3; // how far apart your lips are for the biggest brush
let headTiltAmount = 0.1; // how much lower one eye needs to be than the other

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

  // faces is empty when no face is visible
  if (faces.length > 0) {
    let face = faces[0];
    let nose = face.keypoints[1];
    let topLip = face.keypoints[13];
    let bottomLip = face.keypoints[14];
    let eyeOnLeft = face.keypoints[33];
    let eyeOnRight = face.keypoints[263];

    let mouthOpen = dist(topLip.x, topLip.y, bottomLip.x, bottomLip.y) / face.faceOval.height;

    // y gets bigger going down the canvas, so this is positive when your head
    // tilts to the left of the canvas, and negative when it tilts to the right
    let headTilt = (eyeOnLeft.y - eyeOnRight.y) / face.faceOval.height;

    // the color depends on which way your head is tilted
    fill('peachpuff');
    if (headTilt > headTiltAmount) {
      fill('tomato');
    }
    if (headTilt < -headTiltAmount) {
      fill('steelblue');
    }

    if (mouthOpen > mouthOpenAmount) {
      // true at the end keeps the size between 10 and 80
      let size = map(mouthOpen, mouthOpenAmount, mouthWideAmount, 10, 80, true);
      circle(nose.x, nose.y, size);
    }

    // the mirror is 1/4 the size of the canvas, so divide by 4 to fit
    circle(nose.x / 4, nose.y / 4, 8);

    fill(255);
    textSize(14);
    text('mouth: ' + nf(mouthOpen, 1, 2), 6, 96);
    text('tilt: ' + nf(headTilt, 1, 2), 6, 114);
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
// 1. Add a third color for when your head is straight and your mouth is wide open.
// 2. Add noise to the brush position, like the l key does in
//    mouseAndKeyBoardModifiers, and use a gesture to turn it on.
// 3. Make a new gesture with raised eyebrows. Hint: measure between a point on
//    your eyebrow and a point on your eye, and print (console.log) the number to find a limit.
