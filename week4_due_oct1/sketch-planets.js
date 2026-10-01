// p5.js used in 'global mode'
p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 

function setup(){
  createCanvas(1056, 816); 
  angleMode(DEGREES);
}

function keyPressed(){
  if (key == 's' || key == 'S'){ 
    bDoExportSvg = true; 
  }
}

function draw(){
  background('blue'); 
  noFill();
  
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }

  translate(width / 2, height / 2);

  // 3 Layers of planetary systems, each offset by 3 pixels
  strokeWeight(2); 
  stroke(0);
  
  // 3 Frame and set a little apart
  drawPlanetarySystem(0, 0); // Frame 1
  drawPlanetarySystem(1, 3); // Frame 2
  drawPlanetarySystem(2, 6); // Frame 3

  // Vertical lines
  strokeWeight(6); // Thicker lines for the vertical lines
  stroke(0); 
  
  let offset = (frameCount * 0.5) % 9; // 9px offset for 6px line + 3px gap
  
  for(let i = -600; i <= 600; i += 9) {
       //Goes Horizontally
      line(i + offset + 6, -height/2, i + offset + 6, height/2);
  }

  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }
}

// The planetary system consists of a center, orbits, and planets.
function drawPlanetarySystem(phase, sliceOffset) {
  push();
  
  // The Center
  for (let r = 10; r <= 50; r += 3) {
    drawSlicedCircle(0, 0, r, sliceOffset);
  }
  

  // Orbits
  drawSlicedCircle(0, 0, 150, sliceOffset); 
  drawSlicedCircle(0, 0, 250, sliceOffset); 
  drawSlicedCircle(0, 0, 350, sliceOffset); 

  // Planets
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

// Slicing
function drawSlicedCircle(cx, cy, r, sliceOffset) {
  let isDrawing = false;
  
  for (let angle = 0; angle <= 360; angle += 0.2) {
    let localX = cx + r * cos(angle);
    let localY = cy + r * sin(angle);
    
    // Calculating localX(Slicing)
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