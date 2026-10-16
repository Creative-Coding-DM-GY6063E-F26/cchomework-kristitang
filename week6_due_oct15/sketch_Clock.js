//Time & Space Clock

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
}

function draw() {
  background(8, 8, 12);
  orbitControl(); 
  rotateX(-15);
  
  let ms = millis();
  let s = second() + ms / 1000; // Adding the fractional part of the second for smoother motion
  let m = minute() + s / 60;
  let h = hour() % 12 + m / 60;

  // radius for the clock hands, with seconds being the longest and hours being the shortest
  let rSec = 200;
  let rMin = 140; 
  let rHour = 70; 

  //Making it a topological clock 
  let ambientR = map(sin(ms * 0.03), -1, 1, 40, 200);
  let ambientG = map(sin(ms * 0.04 + 100), -1, 1, 40, 200);
  let ambientB = map(sin(ms * 0.05 + 200), -1, 1, 40, 255);
  let ambientColor = color(ambientR, ambientG, ambientB);

  //Used lerpColor to create a smooth transition and also add motion to the clock hands. 
  let secPulse = map(sin(ms * 0.15), -1, 1, 0.2, 0.8); 
  let colorSec = lerpColor(ambientColor, color(255, 30, 30), secPulse);

  let minPulse = map(sin(ms * 0.1), -1, 1, 0.2, 0.8);
  let colorMin = lerpColor(ambientColor, color(30, 255, 30), minPulse);

  let hourPulse = map(sin(ms * 0.05), -1, 1, 0.2, 0.8);
  let colorHour = lerpColor(ambientColor, color(80, 100, 255), hourPulse);

  let aS = map(s, 0, 60, 0, 360) - 90;
  let aM = map(m, 0, 60, 0, 360) - 90;
  let aH = map(h, 0, 12, 0, 360) - 90;

  //X-Y: Sec & Min
  //Draw the reference dial for seconds and minutes.
  //Use rSec for the radius since seconds hand is the longest and I want the reference dial to encompass both hands.
  drawReferenceDial(rSec, color(255, 255, 255, 60)); 
  
  push();
  rotateZ(aS); 
  drawTopologicalRing(rSec, colorSec, ms);
  drawClockHand(rSec, colorSec);
  pop();

  push();//Isolate the minute hand's rotation and drawing
  rotateZ(aM);
  drawTopologicalRing(rMin, colorMin, ms);
  drawClockHand(rMin, colorMin);
  pop();

  // X-Z: Hour
  push(); // Isolate the hour hand's rotation and drawing
  rotateX(90); // Lay canvas flat for the hour hand to rotate around the Z-axis. 
  drawReferenceDial(rHour, color(255, 255, 255, 60));
  
  rotateZ(aH); 
  drawTopologicalRing(rHour, colorHour, ms);
  drawClockHand(rHour, colorHour);
  pop(); 
}

// This function draws the static 12-hour tick marks around the clock.
function drawReferenceDial(radius, col) {
  push();
  stroke(col);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, 360) - 90; 
    let innerR = radius + 5;
    let outerR = radius + 15;
    
    //Pushed the tick marks out a bit to make them more visible and not overlap with the clock hands.
    //Calculate the coordinates for the inner and outer points of the tick marks
    let x1 = cos(angle) * innerR;
    let y1 = sin(angle) * innerR;
    let x2 = cos(angle) * outerR;
    let y2 = sin(angle) * outerR;

    if (i % 3 === 0) {
      strokeWeight(3);
      line(x1, y1, 0, x2 + cos(angle)*5, y2 + sin(angle)*5, 0); //Thicker, longer tick marks for 3, 6, and 9 o'clock
      if (i === 0) {//Add a special 3D anchor marker for 12 o'clock
        push();
        translate(x2 + cos(angle)*10, y2 + sin(angle)*10, 0);
        noStroke();
        fill(255, 255, 255, 50);
        box(6); 
        pop();
      }
    } else {//Draw a thinner, shorter standard tick mark for the other hours
      strokeWeight(1);
      line(x1, y1, 0, x2, y2, 0);
    }
  }
  pop();
}

//Creating 3D "worm" tube along the plane of the clock hands.
//timeOffset is used to animate the distortion over time.
function drawTopologicalRing(radius, col, timeOffset) {
  noFill();
  strokeWeight(2); 
  
  // Draw 8 concentric circles stacked along the Z-axis to build a 3D "tube"
  for (let j = 0; j < 8; j++) {
    beginShape(); 
    
    // Calculate color fade and Z-depth ONCE per layer (much faster)
    // Front layer (j=0) is fully opaque (255), back layer (j=8) is nearly invisible (10)
    stroke(red(col), green(col), blue(col), map(j, 0, 8, 255, 10));
    let z = map(j, 0, 8, 0, -30); // Push older layers backwards into the screen
    
    // Calculate 60 points to form a single smooth circle
    for (let i = 0; i <= 60; i++) {
      let angle = map(i, 0, 60, 0, 360);
      
      // Base coordinates
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      
      // Sampling a 3D spatial coordinate (x,y,z) plus a 4th dimension (timeOffset).
      let noiseVal = noise(
        x * 0.015, 
        y * 0.015, 
        z * 0.02 + timeOffset * 0.001 //Here is The Engine of Time!
        //By adding time to the Z-axis, the 3D tube is dragged through the invisible noise landscape along the Z-axis.
      );

      // Map the noise value into a physical push/pull distance (-15 to +15 pixels)
      let distortion = map(noiseVal, 0, 1, -15, 15);
      
      // Draw the final vertex
      vertex(
        x + cos(angle) * distortion, 
        y + sin(angle) * distortion, 
        z
      );
    }
    endShape(CLOSE); 
  }
}

function drawClockHand(radius, col) {
  stroke(col);
  strokeWeight(3);
  line(0, 0, 0, radius, 0, 0);
}