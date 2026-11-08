/**
 *
 * Uses the ml5.js handPose model to recognize gestures from the webcam:
 *   thumbs up / thumbs down - shows the name of the gesture
 *   pinch (thumb and index finger together, other fingers open) - draws a line
 *     that follows the hand
 *   spacebar - clear the drawing
 *
 * New to callbacks, createGraphics() or return? Start with ../hand_gestures_concepts
 *
 */
let vid;
let handPose;
let hands = [];

let drawing; // separate layer, so the line stays on top of the video
let lastPinch = null; // where the line ended last frame, null when not pinching

// These are percentages of the hand's size, not pixels, so the gestures
// work the same whether your hand is close to the camera or far away.
let pinchDistance = 0.3; // how close the thumb and index finger need to be
let thumbLength = 0.4; // how far the thumb needs to stick out

let fingers = ['index_finger', 'middle_finger', 'ring_finger', 'pinky_finger'];

async function setup() {
  // the canvas and video are the same size, so the hand's keypoints
  // can be used as canvas positions without any conversion
  createCanvas(640, 480);

  // flipped makes the video act like a mirror
  vid = createCapture(VIDEO, { flipped: true });
  vid.size(width, height);
  vid.hide();

  drawing = createGraphics(width, height);
  drawing.stroke('tomato');
  drawing.strokeWeight(8);

  // handPose needs to be flipped too, so the keypoints line up with the video
  handPose = await ml5.handPose({ maxHands: 1, flipped: true });
  handPose.detectStart(vid, gotHands);
}

function draw() {
  image(vid, 0, 0, width, height);

  let gesture = 'none';
  if (hands.length > 0) {
    gesture = getGesture(hands[0]);
  }

  if (gesture === 'pinch') {
    drawLine(hands[0]);
  } else {
    lastPinch = null; // lifts the pen, so the next pinch starts a new line
  }

  image(drawing, 0, 0);
  showGesture(gesture);
}

function gotHands(results, err) {
  if (err) {
    console.error(err);
    return;
  }
  hands = results; // empty when no hand is visible, which stops the drawing
  
}


// Looks at where the keypoints are and returns the name of the gesture
function getGesture(hand) {
  // wrist to the base of the middle finger is our measure of the hand's size
  let handSize = dist(hand.wrist.x, hand.wrist.y, hand.middle_finger_mcp.x, hand.middle_finger_mcp.y);

  

  // check for a fist first, or a thumb resting on the fingers looks like a pinch
  if (fingersAreCurled(hand)) {
    // how far the thumb reaches, from its middle knuckle to its tip
    let thumbX = hand.thumb_tip.x - hand.thumb_mcp.x;
    let thumbY = hand.thumb_tip.y - hand.thumb_mcp.y;
    let thumbIsVertical = abs(thumbY) > abs(thumbX);

    if (thumbIsVertical && abs(thumbY) > handSize * thumbLength) {
      // y gets bigger going down the canvas, so a negative y means up
      if (thumbY < 0) {
        return 'thumbs up';
      }
      return 'thumbs down';
    }
    return 'none';
  }

  if (dist(hand.thumb_tip.x, hand.thumb_tip.y, hand.index_finger_tip.x, hand.index_finger_tip.y) < handSize * pinchDistance) {
    return 'pinch';
  }

  return 'none';
}

// A finger is curled when its tip is closer to the wrist than its middle joint
function fingersAreCurled(hand) {
  let curledCount = 0;

  fingers.forEach((finger) => {
    let tip = hand[finger + '_tip'];
    let joint = hand[finger + '_pip'];
    if (dist(tip.x, tip.y, hand.wrist.x, hand.wrist.y) < dist(joint.x, joint.y, hand.wrist.x, hand.wrist.y)) {
      curledCount++;
    }
  });

  if (curledCount === fingers.length) {
    return true;
  }
  return false;
}

function drawLine(hand) {
  // the point halfway between the thumb and index finger
  let x = (hand.thumb_tip.x + hand.index_finger_tip.x) / 2;
  let y = (hand.thumb_tip.y + hand.index_finger_tip.y) / 2;

  if (lastPinch) {
    // only move partway to the new point, which smooths out the shaky keypoints
    x = lerp(lastPinch.x, x, 0.5);
    y = lerp(lastPinch.y, y, 0.5);
    drawing.line(lastPinch.x, lastPinch.y, x, y);
  }

  lastPinch = { x: x, y: y };
}

function showGesture(gesture) {
  if (gesture === 'none') {
    return;
  }
  fill(255);
  stroke(0);
  strokeWeight(4);
  textSize(32);
  textAlign(CENTER);
  text(gesture, width / 2, height - 30);
}

function keyPressed() {
  if (keyCode === 32) { // Check if the spacebar is pressed
    drawing.clear();
  }
}

// Exercises for you to try :
// 1. Make the gestures do something: thumbs up could change the line color,
//    and thumbs down could clear the drawing.
// 2. Change the line's strokeWeight based on how close your hand is to the
//    camera. Hint: handSize gets bigger as your hand gets closer.
// 3. Add a new gesture, like an open hand or pointing with one finger.
//    Hint: copy fingersAreCurled() and check the fingers one at a time.
