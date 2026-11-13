// Click drops a white dot. If it hits a box, that box's sound plays.

let sounds = [];
let dots = [];
let boxFlash = [0, 0, 0, 0]; // stays above 0 for a short time after a hit, so the box turns white

let boxCount = 4;
let boxY = 250;
let boxSize = 60;
let gravity = 0.28;


async function setup() {
  createCanvas(400, 400);
  sounds[0] = await loadSound('Bass_Drop.mp3');
  sounds[1] = await loadSound('Drum_Machine.wav');
  sounds[2] = await loadSound('Jazz_Drums.wav');
  sounds[3] = await loadSound('Guitar_String.wav');
}

function draw() {
  background(220);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Click to drop a dot', width / 2, 28);
  textSize(13);
  text('If a dot hits a box, that sound plays', width / 2, 50);

  updateDots();
  drawBoxes();
  drawDots();
}
function boxLeft(i) {
  return 40 + i * 80;
}
function drawBoxes() {
  for (let i = 0; i < boxCount; i++) {
    // White right after a hit, then back to black
    fill(boxFlash[i] > 0 ? 255 : 0);
    stroke(0);
    rect(boxLeft(i), boxY, boxSize, boxSize, 10);

    boxFlash[i] = max(0, boxFlash[i] - 10);
  }
}

function drawDots() {
  noStroke();
  fill(255);
  for (let dot of dots) {
    circle(dot.x, dot.y, dot.r * 2);
  }
}

function updateDots() {
  // Loop backwards so splice() does not skip the next dot
  for (let i = dots.length - 1; i >= 0; i--) {
    let dot = dots[i];

    dot.vy += gravity;
    dot.x += dot.vx;
    dot.y += dot.vy;

    // Bounce off the side walls only below the boxes.
    // Higher up, the dot flies off the screen instead of coming back onto a box.
    if (dot.y > boxY + boxSize && (dot.x < dot.r || dot.x > width - dot.r)) {
      dot.vx *= -1;
      dot.x = constrain(dot.x, dot.r, width - dot.r);
    }

    let hitBox = boxUnder(dot);


    if (hitBox !== -1 && hitBox !== dot.hitBox) {
      if (sounds[hitBox]) {
        sounds[hitBox].play();
      }
      boxFlash[hitBox] = 255;
      kickDot(dot, boxLeft(hitBox));
    }
    dot.hitBox = hitBox;

    if (dot.y - dot.r > height || dot.x < -dot.r || dot.x > width + dot.r) {
      dots.splice(i, 1);
    }
  }
}

// Index of the box this dot overlaps, or -1
function boxUnder(dot) {
  for (let i = 0; i < boxCount; i++) {
    if (circleHitsRect(dot.x, dot.y, dot.r, boxLeft(i), boxY, boxSize, boxSize)) {
      return i;
    }
  }
  return -1;
}

// Pop the dot up and to the side so it leaves the box
function kickDot(dot, x) {
  let centerX = x + boxSize / 2;
  let dir = dot.x < centerX ? -1 : 1;

  // A dot in the middle has no side, so pick left or right
  if (abs(dot.x - centerX) < 4) {
    dir = random([-1, 1]);
  }

  dot.vx = dir * random(8, 12);
  dot.vy = -random(3, 5);

  // Make sure the dot is above the box so it doesn't immediately hit again
  if (dot.y <= boxY + boxSize / 2) {
    dot.y = boxY - dot.r - 2;
  }
}

// Circle overlaps a rectangle when the nearest point on the rectangle is inside the circle
function circleHitsRect(cx, cy, r, rx, ry, rw, rh) {
  let closestX = constrain(cx, rx, rx + rw);
  let closestY = constrain(cy, ry, ry + rh);
  let dx = cx - closestX;
  let dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

function mousePressed() {
  userStartAudio();

  dots.push({
    x: mouseX,
    y: mouseY,
    vx: 0,
    vy: 0,
    r: random(6, 16),
    hitBox: -1 // -1 means it is not touching a box yet
  });
}
