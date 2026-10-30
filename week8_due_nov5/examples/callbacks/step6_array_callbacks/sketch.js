/**
 *
 * STEP 6: array callbacks.
 *
 *   array.forEach(fn) - call fn once for every item in the array
 *   array.filter(fn)  - call fn on every item; keep the ones where fn returns true
 *
 *   click - blow bubbles
 *
 */
let bubbles = [];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20);

  // forEach calls drawBubble(bubble) for each bubble in the array.
  // Same as: for (let i = 0; i < bubbles.length; i++) { drawBubble(bubbles[i]); }
  bubbles.forEach(drawBubble);

  // filter calls our arrow function for each bubble and builds a NEW array
  // with only the bubbles still on screen. The rest are thrown away.
  bubbles = bubbles.filter((b) => b.y > -b.size);
  //the filter function is 'the y value is greater than the negative size'
  //if the y value is less than its negative size, it's not visible so we filter that one out

  fill(255);
  text('bubbles: ' + bubbles.length, 10, 20);
}

function drawBubble(b) {
  noFill();
  stroke(255);
  circle(b.x, b.y, b.size);
  b.y -= b.speed; // float upward
}

function mousePressed() {
  for (let i = 0; i < 10; i++) {
    bubbles.push({
      x: mouseX + random(-30, 30),
      y: mouseY + random(-30, 30),
      size: random(10, 40),
      speed: random(1, 4),
    });
  }
}

// Try it: comment out the filter line and click a lot.
// Watch the bubble count. Why does that matter?
