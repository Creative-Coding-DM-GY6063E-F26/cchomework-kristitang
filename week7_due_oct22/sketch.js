/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper; // variable to store pMapper object (projection mapping library)
let quadLeft, quadRight, quadTop; // my quad surfaces

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // create mapper object
  pMapper = createProjectionMapper(this);
  //pMapper.load("map.json");

  // create "quads" for each surface of your projection
  quadLeft = pMapper.createQuadMap(400, 400, 20, 20); // 20x20 mesh matches map.json. quads should be proportionate to the physical object you are projecting onto
  quadRight = pMapper.createQuadMap(400, 400, 20, 20);
  quadTop = pMapper.createQuadMap(400, 400, 20, 20);

}

function draw() {
  background(0);

  // display each of the projection surfaces in draw
  quadLeft.displaySketch(mySketch);
  quadRight.displaySketch(myOtherSketch);
  quadTop.display(color("red"));
}

function mySketch(pg){ // "pg" refers to each canvas "instance"
  pg.clear();
  pg.push();
  // your sketch goes between push and pop. remember to use the 'pg.' prefix for all p5 functions
  pg.background(0,255,0);
  pg.textAlign(CENTER,CENTER);
  pg.textSize(70);
  pg.fill(color('black'));
  pg.text('hello world, this is text',200,175);
  // ends here
  pg.pop();
}

function myOtherSketch(pg){
  pg.clear();
  pg.push();
  // your mini sketch goes here!
  
  pg.background(255,0,0);
  
  pg.rectMode(CORNERS);  
  // and ends here!
  pg.pop();
}

function keyPressed() { // keypressed toggles different modes
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;
    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;
    case "l":
      pMapper.load("map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}