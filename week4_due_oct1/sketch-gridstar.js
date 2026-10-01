// This is the sketch.js file.
// Press 's' to export the SVG.
// Note that p5.js is used in 'global mode'. 

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
  background(255); 
  noFill();//Disable fill for the SVG export.
  stroke(0);//Ensure the stroke is black for the SVG export.
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }
  strokeWeight(5);

  //Draw stuff here, such as:
  //line(0,0, mouseX, mouseY); 
  //stroke('grey');
  //for(let j=0; j<height; j+=40){
  //  for(let i = 0; i < width; i+=40){
  //    square(i, j, 40);
  //  }
  //}

  translate(20,30)
  rotate(PI/100);
  stroke(0);
  for(let j=0; j<height; j+=40){
    for(let i = 0; i < width; i+=40){
      square(i, j, 40);
    }
  }

  translate(20,30)
  rotate(PI/100);
  stroke(0);
  for(let j=0; j<height; j+=40){
    for(let i = 0; i < width; i+=40){
      square(i, j, 40);
    }
  }


  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }
}