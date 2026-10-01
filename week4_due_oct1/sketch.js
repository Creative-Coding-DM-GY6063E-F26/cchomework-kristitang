// p5.js used in 'global mode'
p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 

function setup(){
  // Canvas is slightly smaller than US Letter (7.5" x 10" at 96dpi)
  // This gives you a nice half-inch safe margin around the paper!
  createCanvas(720, 960); 
  angleMode(DEGREES);
}

function keyPressed(){
  if (key == 's' || key == 'S'){ 
    bDoExportSvg = true; 
  }
}

function draw(){
  background(255); 
  noFill();
  
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }

  translate(width / 2, height / 2);
  
  // Rotate 90 degrees so the plotter prints it vertically, 
  // but you view the final paper horizontally!
  rotate(90); 

  // --- 1. DRAW THE 3 FRAMES (The Art) ---
  strokeWeight(2); // Keep the drawing pen thin (size 1 or 2)
  stroke(0);
  
  drawPlanetarySystem(0, 0); 
  drawPlanetarySystem(1, 3); 
  drawPlanetarySystem(2, 6); 

  // --- 2. DRAW THE MOVING MASK ---
  strokeWeight(6); // Your 6px Mask Pen
  stroke(0); 
  
  let offset = (frameCount * 0.5) % 9; 
  
  // -600 to 600 ensures the lines draw far enough to cover the entire page
  for(let i = -600; i <= 600; i += 9) {
      line(i + offset + 6, -600, i + offset + 6, 600);
  }

  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }
}

// --- PLANETARY SYSTEM ---
function drawPlanetarySystem(phase, sliceOffset) {
  push();
  
  // 1. SUN
  for (let r = 10; r <= 50; r += 5) {
    drawSlicedCircle(0, 0, r, sliceOffset);
  }

  // 2. ORBITS
  drawSlicedCircle(0, 0, 150, sliceOffset); 
  drawSlicedCircle(0, 0, 250, sliceOffset); 
  drawSlicedCircle(0, 0, 350, sliceOffset); 

  // 3. PLANETS
  let angle1 = phase * 120; 
  let p1x = 150 * cos(angle1);
  let p1y = 150 * sin(angle1);
  drawSlicedPlanet(p1x, p1y, 20, sliceOffset);

  let angle2 = 180 - (phase * 120); 
  let p2x = 250 * cos(angle2);
  let p2y = 250 * sin(angle2);
  drawSlicedPlanet(p2x, p2y, 30, sliceOffset);

  let angle3 = 270 + (phase * 120); 
  let p3x = 350 * cos(angle3);
  let p3y = 350 * sin(angle3);
  drawSlicedPlanet(p3x, p3y, 40, sliceOffset);

  pop();
}

function drawSlicedPlanet(cx, cy, maxRadius, sliceOffset) {
  for (let r = 5; r <= maxRadius; r += 5) {
    drawSlicedCircle(cx, cy, r, sliceOffset);
  }
}

// --- VECTOR SLICING ---
function drawSlicedCircle(cx, cy, r, sliceOffset) {
  let isDrawing = false;
  
  for (let angle = 0; angle <= 360; angle += 0.2) {
    let localX = cx + r * cos(angle);
    let localY = cy + r * sin(angle);
    
    let shiftedX = (localX - sliceOffset) % 9;
    if (shiftedX < 0) shiftedX += 9; 
    
    let isInside = (shiftedX >= 0 && shiftedX < 3);

    if (isInside) {
      if (!isDrawing) {
        beginShape();
        isDrawing = true;
      }
      vertex(localX, localY);
    } else {
      if (isDrawing) {
        endShape();
        isDrawing = false;
      }
    }
  }
  if (isDrawing) endShape();
}