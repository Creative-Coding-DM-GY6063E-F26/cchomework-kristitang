// This is the sketch.js file.
// Press 's' to export the SVG.
// Note that p5.js is used in 'global mode'. 

//Mona Lisa
//I am thinki to use cicles only to draw a mona lisa, kinda like a half tone style
//Maybe I shall draw the shaped face first and then write a function to read the current pixel's color to dertermine the circle's size.
//Learnt about img
p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 
let img;

async function setup() {
  createCanvas(400, 600);

  img = await loadImage("./400x600.jpg");
  img.resize(width, height);

  noLoop();
}

function keyPressed(){
  if (key == 's' || key == 'S'){ 
    bDoExportSvg = true; 
    redraw();
  }
}

function draw(){
  background(255); 
  noFill()
  stroke(0); 
  
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }
  
  strokeWeight(2);

  // mode 1 ignores keepChance and draws every circle, and keep chance is 1
  drawHalftone(12, 150, 1, 1);

  // A smaller lightCutoff redraws only the darker pixels, where the circles are larger.
  rotate(-PI/60)
  drawHalftone(12, 80, 1, 1);

  // mode 2 uses keepChance. Set the keep chance less than 1 so that not every circles is going to be redraw
  rotate(PI/1-0)
  drawHalftone(12, 150, 2, 0.2)



  if (bDoExportSvg){
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