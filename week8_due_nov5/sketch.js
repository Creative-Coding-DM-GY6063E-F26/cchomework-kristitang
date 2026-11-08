let vid;
let handPose;
let hands = [];
let paintLayer;

// Variables for smooth interpolation - lerp
let smoothedX = 0;
let smoothedY = 0;
let isHandPresent = false;

let palettes = [
  [30, 30, 30],    // Ink Black
  [20, 160, 170],  // Mineral Cyan 
  [210, 50, 40]    // Cinnabar Red 
];
let currentIndex = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Setup webcam with mirrored view
  vid = createCapture(VIDEO, { flipped: true });
  vid.size(320, 240);
  vid.hide();

  paintLayer = createGraphics(width, height);
  // Round caps and joints for ultra-smooth line ends
  paintLayer.strokeCap(ROUND);
  paintLayer.strokeJoin(ROUND);

  handPose = await ml5.handPose({ maxHands: 1, flipped: true });
  handPose.detectStart(vid, results => hands = results);
}

function draw() {
  // Rice paper background color
  background(242, 240, 235); 
  image(paintLayer, 0, 0);

  if (hands.length > 0) {
    let tip = hands[0].index_finger_tip;
    
    if (tip) {
      // Map webcam coordinates to canvas size
      let targetX = map(tip.x, 0, vid.width, 0, width);
      let targetY = map(tip.y, 0, vid.height, 0, height);

      // Snap to target instantly if hand just entered the frame
      if (!isHandPresent) {
        smoothedX = targetX;
        smoothedY = targetY;
        isHandPresent = true;
      }

      // Apply linear interpolation 
      smoothedX = lerp(smoothedX, targetX, 0.15);
      smoothedY = lerp(smoothedY, targetY, 0.15);

      // Map hand speed to brush thickness (Fast = thin, Slow = thick)
      let speed = dist(smoothedX, smoothedY, targetX, targetY);
      let brushSize = map(speed, 0, 50, 40, 5, true); 

      let c = palettes[currentIndex];
      
      if (currentIndex === 0 || currentIndex === 1) {
        //For black and cyan, 
        paintLayer.stroke(c[0], c[1], c[2], 150); 
        paintLayer.strokeWeight(brushSize);
        paintLayer.line(smoothedX, smoothedY, targetX, targetY);
      } 
      else if (currentIndex === 2) {
        // Red Ink Wash - Soft bleeding circles)
        paintLayer.noStroke();
        paintLayer.fill(c[0], c[1], c[2], 12);
        
        for (let i = 0; i < 6; i++) {
          let r = brushSize + random(-5, 20);
          paintLayer.circle(smoothedX + random(-5, 5), smoothedY + random(-5, 5), r);
        }
      }

      // Fingertip indicator
      noStroke();
      fill(c[0], c[1], c[2], 220); 
      circle(targetX, targetY, 12);
    }
  } else {
    // Reset brush start position when hand leaves screen
    isHandPresent = false;
  }
  
  bottomUI();
}

function bottomUI() {
  // 
  fill(150, 150); 
  noStroke();
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text("SPACE : Change Brush   |   C : Clear Canvas", 20, height - 20);
}

function keyPressed() {
  // Cycle through the 3 brush styles
  if (key === ' ') { //Space to change color
    currentIndex = (currentIndex + 1) % 3;
    return false; 
  }
  // Clear the drawing layer
  if (key.toLowerCase() === 'c') {
    paintLayer.clear();
  }
}