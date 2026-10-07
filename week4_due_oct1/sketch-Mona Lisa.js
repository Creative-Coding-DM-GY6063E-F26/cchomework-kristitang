// This is the sketch.js file.
// Press 's' to export the SVG.
// Note that p5.js is used in 'global mode'. 

//Mona Lisa
//I am thinki to use cicles only to draw a mona lisa, kinda like a half tone style
//Maybe I shall draw the shaped face first and then write a function to read the current pixel's color to dertermine the circle's size.
p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 
let img;

function preload() {
  console.log("Preload is running! Attempting to load image...");
  img = loadImage('./monalisa.jpg'); 
}

function setup(){
  createCanvas(600, 600); 
  
// Safely check if the image loaded before resizing
  if (img && img.width > 0) {
    img.resize(width, height);
  } else {
    console.error("IMAGE MISSING: The image didn't load. Check the file name and folder!");
  }
  
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
  noFill(); 
  stroke(0); 
  
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }
  
  strokeWeight(1);
  
  img.loadPixels();
  let stepSize = 8; 
  
  for (let y = 0; y < img.height; y += stepSize) {
    for (let x = 0; x < img.width; x += stepSize) {
      
      let index = (x + y * img.width) * 4;
      
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      
      let brightness = (r + g + b) / 3;
      let diameter = map(brightness, 0, 255, stepSize * 1.2, 0);
      
      if (diameter > 0.5) {
        circle(x + (stepSize / 2), y + (stepSize / 2), diameter);
      }
    }
  }

  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }
}