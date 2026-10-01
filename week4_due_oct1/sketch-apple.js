// This is the sketch.js file.
// Press 's' to export the SVG.
// Note that p5.js is used in 'global mode'. 

//Apple
p5.disableFriendlyErrors = true; // keep warnings quiet
let bDoExportSvg = false; 

function setup(){
  // These canvas dimensions are 8.5"x11" at 96 dpi
  createCanvas(816, 1056); 

  //randomSeed(100); // random seed for randomness
  noLoop(); // don't loop, just draw once
}

function keyPressed(){
  //if (key == 'r'){
  //  draw(); // redraw the canvas
  //}
  if (key == 's'){ 
    bDoExportSvg = true; 
    redraw();
  }
}

function draw(){
  background('#FE7F9C'); 
  noFill();//Disable fill for the SVG export.
  angleMode(DEGREES);
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }
  translate(width/2, height/2);
  stroke('red');
  strokeWeight(2.5);
  let circleR;
  let deltaX
  deltaX= 8;
  deltaY= 10;
  circleR = 200;
  circle(0,0, circleR);
  //Draw the sides
  for (let i = 0; i < 10; i++){
    circle(-deltaX*i,0, circleR+i*8);
  }
  for (let i = 0; i < 10; i++){
    circle(deltaX*i,0, circleR+i*8);
  }
  for (let i = 0; i < 6; i++){
    bezier(0, -circleR/2, 
          -10, -120,
          -10, -150,
          0+deltaY*i, -250);
  }

  drawScanlineStar(0, 0, 60, 20, 4,0);

  //Second layer
  rotate(4); 
  circle(0,0, circleR);
  for (let i = 0; i < 10; i++){
    circle(-deltaX*i,0, circleR+i*8);
  }
  for (let i = 0; i < 10; i++){
    circle(deltaX*i,0, circleR+i*8);
  }
  drawScanlineStar(0, 0, 60, 20, 4,10);
  drawScanlineStar(5, 5, 60, 20, 4,10);
  for (let i = 0; i < 6; i++){
    bezier(0, -circleR/2, 
          -10, -120,
          -10, -150,
          0+deltaY*i, -250);
  }
  for(let i = 0; i < 10; i++){
    drawScanlineStar(random(-300,300), random(-300,200), 60, 20, 4,10);
  }
  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }

}

// draw star function that I made for last week's assignment
function drawScanlineStar(cx, cy, outerR, innerR, stepSize, distortionAmount = 0) {
  let vertices = [];
  
  for (let i = 0; i < 10; i++) {
    let angle = i * 36;
    let r = i % 2 === 0 ? outerR : innerR; 
    
    // Create random jitter based on the distortionAmount
    let randomR = r + random(-distortionAmount, distortionAmount);
    let randomAngle = angle - 90 + random(-distortionAmount/2, distortionAmount/2);
    
    let vx = cx + cos(randomAngle) * randomR;
    let vy = cy + sin(randomAngle) * randomR;
    
    vertices.push({ x: vx, y: vy });
  }

  let topY = cy - outerR;
  let bottomY = cy + outerR;
  
  for (let y = topY; y <= bottomY; y += stepSize) {
    let intersects = [];
    for (let i = 0; i < vertices.length; i++) {
      let p1 = vertices[i];
      let p2 = vertices[(i + 1) % vertices.length];

      if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
        let intersectX = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
        intersects.push(intersectX);
      }
    }
    intersects.sort((a, b) => a - b);
    for (let i = 0; i < intersects.length; i += 2) {
      if (intersects[i + 1] !== undefined) {
        line(intersects[i], y, intersects[i + 1], y);
      }
    }
  }
}