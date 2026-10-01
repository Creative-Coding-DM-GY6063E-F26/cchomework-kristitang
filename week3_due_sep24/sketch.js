function setup() {
  createCanvas(400, 400);

}

function draw() {
    background('#DAC7AF');

    angleMode(DEGREES);

//Layer 1
    //Pink quadrilateral
    stroke(0,0,0,0)
    fill('pink')
    quad(223, 218, 
        378, 245, 
        378, 298, 
        222, 275);
    //Maroon point
    stroke(150,50,50)
    strokeWeight(50)
    point(120, 0)
    // Green
    strokeWeight(0)
    fill(60,125,90)
    // Custom shape
    beginShape();
    vertex(317, -3); // First point
    vertex(360, 10); // Second point
    vertex(354, 74); // Third point
    vertex(333, 90); //...
    vertex(306, 70);
    endShape(CLOSE); // Close the shape

    quad(30, 194, 
        147, 192, 
        149, 214, 
        30, 218);

    //The flag
    let px = 294 // delta is +10
    let py = 260 // delta is +55
        quad(px, py, 
        px+10, py-1, 
        px+11, py+54, 
        px+1, py+55);

        quad(px+20, py-2, 
        px+30, py-3, 
        px+31, py+52, 
        px+21, py+53);
    
        quad(146, 90, 
        164, 90,
        197, 116,
        146, 100, 
        );

    // Red flag
    fill(150,50,50)
    beginShape();
    vertex(120, 210); 
    vertex(165, 207); 
    vertex(177, 218); 
    vertex(171, 226); 
    vertex(122, 230);
    endShape(CLOSE); 

    triangle(170,205,185,204.5,185,218)
    triangle(172,230,185,229,185,216)
    endShape(CLOSE); 
    

    
//Layer 2
    // Start drawing the white ribbons.
    fill(255)
    stroke('black');
    strokeWeight(0.05);
    line(50, 100, 
        185, 50);
    line(70, 110, 
        216, 55);
    fill('white')
    quad(45, 56, 
        60, 60, 
        146, 0,
        120, 0, 
        );
    quad(50, 100, 
        185, 50, 
        216, 55,
        70, 110, 
        );
    quad(238, 64, 
        258, 66, 
        382, 0,
        355, 0, 
        );
    quad(160, 180, 
        186, 186, 
        0, 232,
        0, 224, 
        );
    quad(184, 144, 
        200, 150, 
        383, 80,
        354, 84,
        );
    quad(358, 186, 
        394, 190, 
        130, 246,
        116, 241,
        );

//Layer 3
    stroke(0,0,0,0)
    //Orange quadrilateral
    strokeWeight(0)
    fill(230, 106, 55,230)
    quad(170, 138, 
        255, 20, 
        345, 150, 
        265, 270);
    quad(20, 400, 
        60, 340, 
        100, 400, 
        60, 400);
        
    //Maroon
    fill(150,50,50)
    push();
    rotate(-5)
    rect(135, 160, 20, 12, 20);
    pop()

    quad(146, 90, 
    164, 90,
    197, 116,
    146, 100, 
    );

    stroke(150,50,50)
    strokeWeight(12)
    point(330, 217)

    strokeWeight(0)
    fill(60,125,90)
    triangle(146, 107, 
    146, 115, 
    197, 116);

    //Yellow
    fill('gold')
    triangle(178, 90, 
    197.5, 90, 
    197, 116);

    strokeWeight(15)
    stroke('#00308F')
    point(245,255)
    point(247,119)
    point(340,195)
    point(367,100)
    point(395,26)
    point(257,352)//Paint this again later as it has been covered

    strokeWeight(4)
    stroke('gold')
    line(43,210,0,230)
    line(43,238,0,215)
    push()
    fill('gold')
    strokeWeight(0)
    rotate(40)
    // x, y, width, height, start angle, stop angle, mode
    let arcX=380
    let arcY =110
    arc(arcX, arcY, 360, 30, 180, 360, CHORD);
    quad(arcX-180,arcY,
        arcX-140,arcY+50,
        arcX+140,arcY+50,
        arcX+180,arcY,)
    strokeWeight(0)
    fill('#DAC7AF')//background color covering up
    arc(arcX, arcY+51, 280, 30, 180, 360, CHORD);
    pop()

    stroke('#00308F')
    strokeWeight(15)
    point(257,352)

    //Dandelion
    stroke('#FAD6A5');
    let danX = 285; // Bottom
    let danY = 130;

    let lX; 
    let lY; 

    for (let j = 0; j <= 5; j++) {
        strokeWeight(10);
        for (let i = 0; i <= 8; i++) {
            // i === 4 is the 5th point (0, 1, 2, 3, 4)
            // i!==4 is to ensure that other points being drawn
            // j === 5 is the top row (the last loop iteration)
            if (i !== 4 || j === 5) {
                point(danX + i * 16, danY);
            }
            if (i===4&&j===5){
                lX=danX+i*16;
                lY = danY;
            }
            danY = danY - 1.8;
        }
        
        strokeWeight(2);
        // Draws the slanted underline
        line(danX, danY + 1.8 * 9, danX + 18 * 8, danY);
    }
    line(lX,lY,
        lX-5,danY+140
    )
    line(lX+3,danY+200,
    lX-5,danY+140
    )

    //Yellow sticker
    strokeWeight(15)
    stroke('gold')
    line(lX+8,danY+141,
    lX-5,danY+140
    )
    line(lX-10,danY+143,
    lX-5,danY+140
    )

    //Black star - Line by line may be approachable but failed for now...
    //stroke('black')
    //strokeWeight(1)
    //let starX = 300
    //let starY =300
    //let starW = 3
    //let starH = 3
    //for(let i =1;i<=5; i++){
    //line(starX-starW*i*2,starY+(i-1)*starH,
    //    starX+starW*i*2,starY+(i-1)*starH)
    //}
    //starY = starY +4*starH
    //for(let i =1;i<=5; i++){
    //    line(starX-starW*i*2,starY-(i-1)*starH,
    //        starX+starW*i*2,starY-(i-1)*starH)
    //}

    stroke('black')
    strokeWeight(0.5)
    drawScanlineStar(345, 350, 30, 12, 4);
    drawScanlineStar(350, 350, 30, 12, 4);
    strokeWeight(1)
    drawScanlineStar(355, 350, 30, 12, 4);

}
function drawScanlineStar(cx, cy, outerR, innerR, stepSize) {
  let vertices = [];
  
  // Build the invisible skeleton (10 points for a 5-pointed star)
  for (let i = 0; i < 10; i++) {
    let angle = i * 36;//360/10=36
    let r = i % 2 === 0 ? outerR : innerR; //Checks if the current step i is an even number. 
    //If it is even, it uses the large outerR (for a pointy tip). If it is odd, it uses the smaller innerR (for an inner corner).
    let vx = cx + cos(angle - 90) * r;
    let vy = cy + sin(angle - 90) * r;
    //cos for horizontal, sin for vertical
    vertices.push({ x: vx, y: vy });
    //Saves the X and Y coordinates into the vertices list
  }

  // Determine the exact top and bottom of this specific star
  let topY = cy - outerR;
  let bottomY = cy + outerR;
  
  // Scan down the canvas line by line starting at topY, stops at bottomY, and moves down the canvas by stepSize pixels every loop.
  for (let y = topY; y <= bottomY; y += stepSize) {
    let intersects = [];

    // Check this horizontal line against all 10 edges of the star
    for (let i = 0; i < vertices.length; i++) {
      let p1 = vertices[i];
      let p2 = vertices[(i + 1) % vertices.length];

      if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {//Checks if the current slanted edge crosses the current height (y) of our scanner.
        let intersectX = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
        intersects.push(intersectX);//Calculates the exact horizontal pixel coordinate (intersectX) where the scanner touches the edge
      }
    }

    // Sort intersections left to right, from smallest to largest
    intersects.sort((a, b) => a - b);

    // Draw lines between pairs of intersections
    for (let i = 0; i < intersects.length; i += 2) {
      if (intersects[i + 1] !== undefined) {
        line(intersects[i], y, intersects[i + 1], y);
      }
    }
  }
}