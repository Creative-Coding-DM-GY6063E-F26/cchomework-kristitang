/**
 *
 * Uses the ml5.js faceMesh model to show how to get to each part of the face
 * by its key. Look at the webcam and each part gets a colored box, with a line
 * from its name in the top left corner.
 *
 * Every part of the face is a key on the face object:
 *   faces[0].faceOval
 *   faces[0].leftEye
 *   faces[0].rightEye
 *   faces[0].leftEyebrow
 *   faces[0].rightEyebrow
 *   faces[0].lips
 *
 * Unlike a finger joint, a part of the face is a whole area and not one point.
 * So each part has a box around it, and these keys tell you about that box:
 *   faces[0].lips.x          the left edge of the box
 *   faces[0].lips.y          the top edge of the box
 *   faces[0].lips.width      how wide the box is
 *   faces[0].lips.height     how tall the box is
 *   faces[0].lips.centerX    the middle of the box, left to right
 *   faces[0].lips.centerY    the middle of the box, top to bottom
 *   faces[0].lips.keypoints  an array of all the points that outline the part
 *
 * Watch out! The video is flipped like a mirror, and that swaps the names too.
 * faces[0].leftEye is the eye on the right side of the canvas, which is really
 * your right eye. The same goes for the eyebrows.
 *
 * There is no faces[0].nose. Anything without a name can still be reached by
 * its number in the big array of keypoints. The tip of the nose is number 1:
 *   faces[0].keypoints[1].x
 *   faces[0].keypoints[1].y
 *
 */
let vid;
let faceMesh;
let faces = [];

// the size and position of the list of names, in pixels
let listX = 10;
let listWidth = 110;
let rowHeight = 20;

async function setup() {
  // the canvas and video are the same size, so the face's keypoints
  // can be used as canvas positions without any conversion
  createCanvas(640, 480);

  // flipped makes the video act like a mirror
  vid = createCapture(VIDEO, { flipped: true });
  vid.size(width, height);
  vid.hide();

  // faceMesh needs to be flipped too, so the keypoints line up with the video
  faceMesh = await ml5.faceMesh({ maxFaces: 1, flipped: true });
  faceMesh.detectStart(vid, gotFaces);
}

function draw() {
  image(vid, 0, 0, width, height);

  // faces is empty when no face is visible
  if (faces.length > 0) {
    let face = faces[0];

    showPart(face.faceOval, 'faceOval', 'white', 10);
    showPart(face.leftEyebrow, 'leftEyebrow', 'violet', 30);
    showPart(face.rightEyebrow, 'rightEyebrow', 'deepskyblue', 50);
    showPart(face.leftEye, 'leftEye', 'limegreen', 70);
    showPart(face.rightEye, 'rightEye', 'gold', 90);
    showPart(face.lips, 'lips', 'tomato', 110);

    showNose(face.keypoints[1], 130);
  }
}

function gotFaces(results) {
  faces = results;
}

// Draws one part of the face, and a line to it from its name in the list
function showPart(part, name, partColor, y) {
  // the box around the part
  noFill();
  stroke(partColor);
  strokeWeight(2);
  rect(part.x, part.y, part.width, part.height);

  line(listX + listWidth, y + rowHeight / 2, part.centerX, part.centerY);

  // every point that outlines the part
  noStroke();
  fill(partColor);
  part.keypoints.forEach((point) => {
    circle(point.x, point.y, 4);
  });

  showName(name, partColor, y);
}

// The nose is a single keypoint, so it has an x and a y but no box
function showNose(point, y) {
  stroke('orange');
  strokeWeight(2);
  line(listX + listWidth, y + rowHeight / 2, point.x, point.y);

  noStroke();
  fill('orange');
  circle(point.x, point.y, 10);

  showName('keypoints[1]', 'orange', y);
}

// Draws one row of the list, the name highlighted in the part's color
function showName(name, nameColor, y) {
  noStroke();
  fill(nameColor);
  rect(listX, y, listWidth, rowHeight);

  fill(0);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(name, listX + 6, y + rowHeight / 2);
}

// Exercises for you to try :
// 1. Directly address a part of your face, like faces[0].lips, and draw a
//    circle() at its centerX and centerY.
// 2. Give yourself a clown nose using faces[0].keypoints[1].
// 3. Draw glasses: a circle on each eye, sized with leftEye.width and
//    rightEye.width, so they grow as you get closer to the camera.
