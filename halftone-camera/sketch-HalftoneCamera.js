// Halftone Camera
// The circles are redrawn from the live camera image.
// The drawing window keeps the camera's shape.
// Press 's' or Save SVG to export the current frame.

p5.disableFriendlyErrors = true;
let bDoExportSvg = false;
let cam;
let img;
let dotSpacing = 8;
let lightSkip = 150;
let bgRed = 255;
let bgGreen = 255;
let bgBlue = 255;

function setup() {
  fitCanvas();

  // The gallery thumbnail should not ask for the camera.
  if (document.documentElement.classList.contains("preview")) {
    noLoop();
    return;
  }

  cam = createCapture(VIDEO);
  cam.hide();

  let saveButton = document.getElementById("save-svg");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      bDoExportSvg = true;
    });
  }
}

function viewSize() {
  let camW = 4;
  let camH = 3;
  if (captureReady()) {
    camW = cam.width;
    camH = cam.height;
  }

  let narrow = windowWidth <= 700;
  let maxW = narrow ? Math.max(240, windowWidth - 28) : Math.max(360, windowWidth - 280);
  let maxH = narrow ? Math.max(180, windowHeight * 0.55) : Math.max(270, windowHeight - 70);
  let w = maxW;
  let h = w * camH / camW;
  if (h > maxH) {
    h = maxH;
    w = h * camW / camH;
  }

  return { w: Math.round(w), h: Math.round(h) };
}

function fitCanvas() {
  let size = viewSize();
  if (img && width === size.w && height === size.h) {
    return;
  }

  if (!img) {
    let canvas = createCanvas(size.w, size.h);
    canvas.parent("stage");
  } else {
    resizeCanvas(size.w, size.h);
  }

  pixelDensity(1);
  img = createGraphics(width, height);
  img.pixelDensity(1);
}

function windowResized() {
  fitCanvas();
}

function readControls() {
  dotSpacing = readNumber("spacing", 8);
  lightSkip = readNumber("light", 150);
  bgRed = readNumber("red", 255);
  bgGreen = readNumber("green", 255);
  bgBlue = readNumber("blue", 255);
  writeNumber("spacing-val", dotSpacing);
  writeNumber("light-val", lightSkip);
  writeNumber("red-val", bgRed);
  writeNumber("green-val", bgGreen);
  writeNumber("blue-val", bgBlue);
}

function readNumber(id, fallback) {
  let field = document.getElementById(id);
  if (!field) {
    return fallback;
  }
  let value = Number(field.value);
  return Number.isFinite(value) ? value : fallback;
}

function writeNumber(id, value) {
  let field = document.getElementById(id);
  if (field) {
    field.textContent = value;
  }
}

function captureReady() {
  return cam && cam.elt && cam.elt.readyState >= 2 && cam.width > 0;
}

function keyPressed() {
  if (key == "s" || key == "S") {
    bDoExportSvg = true;
  }
}

function draw() {
  fitCanvas();
  readControls();
  background(bgRed, bgGreen, bgBlue);
  noFill();
  stroke(255 - bgRed, 255 - bgGreen, 255 - bgBlue);

  if (!captureReady()) {
    fill(255 - bgRed, 255 - bgGreen, 255 - bgBlue);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Allow the camera to draw from the live image", width / 2, height / 2);
    return;
  }

  // Fit the current frame to the window. Flip it so the view behaves like a mirror.
  img.push();
  img.background(255);
  img.translate(img.width, 0);
  img.scale(-1, 1);
  img.image(cam, 0, 0, img.width, img.height);
  img.pop();

  if (bDoExportSvg) {
    beginRecordSvg("myOutput.svg");
  }

  strokeWeight(2);

  // The darker pass stays a bit below Light skip, so large dots still overlap.
  let darkSkip = Math.round(lightSkip * 0.53);

  // mode 1 ignores keepChance and draws every circle, and keep chance is 1
  drawHalftone(dotSpacing, lightSkip, 1, 1);

  // A smaller lightCutoff redraws only the darker pixels, where the circles are larger.
  rotate(-PI / 60);
  drawHalftone(dotSpacing, darkSkip, 1, 1);

  // mode 2 uses keepChance. Set the keep chance less than 1 so that not every circles is going to be redraw
  rotate(PI / 1 - 0);
  drawHalftone(dotSpacing, lightSkip, 2, 0.2);

  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}

// stepSize sets the widest circle: a black pixel is drawn at stepSize.
// lightCutoff drops any pixel brighter than this, so light areas are not plotted.
function circleDiameter(x, y, stepSize, lightCutoff) {
  let index = (x + y * img.width) * 4;
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  let brightness = (r + g + b) / 3;

  if (brightness > lightCutoff) {
    return 0;
  }

  return map(brightness, 0, 255, stepSize, 0);
}

// mode 2 uses the cell position, so a layer skips the same circles every time.
// The pattern stays put when you export the SVG.
function keepCircle(x, y, mode, keepChance) {
  if (mode !== 2) {
    return true;
  }

  let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  let chance = n - Math.floor(n);
  return chance < keepChance;
}

// stepSize is the grid spacing: the loops jump this many pixels across and down.
// mode 1 keeps every circle and does not read keepChance.
// mode 2 keeps each circle with probability keepChance.
function drawHalftone(stepSize, lightCutoff, mode, keepChance) {
  img.loadPixels();

  for (let y = 0; y < img.height; y += stepSize) {
    for (let x = 0; x < img.width; x += stepSize) {
      if (!keepCircle(x, y, mode, keepChance)) {
        continue;
      }

      let diameter = circleDiameter(x, y, stepSize, lightCutoff);

      if (diameter > 0.5) {
        circle(x + (stepSize / 2), y + (stepSize / 2), diameter);
      }
    }
  }
}
