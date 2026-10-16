
function setup() {
  createCanvas (400, 400)
  background (220) ;
}
function draw() {

}

function mousePressed() {
  let newCircle = new Circle(mouseX, mouseY, 50);
  newCircle.draw();
//create a new Shape class that has a draw method. 
//The draw method should use the fill and [shape] functions to draw a shape on the canvas.
//Then, create an instance of the Shape class in the mousePressed function and call its draw method to draw the shape on the canvas.
  let newSquare = new Square(mouseX, mouseY, 50, random(100), random(50), random(50), random(50));
  newSquare.draw();
}

class Circle {
  constructor(x, y, r) {
    //The constructor only run once when the object is created
    this.x = x;
    this.y = y;
    this.r = r;
  }
  draw() {
    fill(random(255), random(255), random(255));
    ellipse(this.x, this.y, this.r, this.r);
  }
}

class Square {
  constructor(x, y, s, tl,tr, bl, br) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.tl = tl;
    this.tr = tr;
    this.bl = bl;
    this.br = br;
    if(this.s<this.tl){
      this.s = this.tl*2;
    }
    if(this.s>this.tl){
      this.s = this.tl*0.5;
    }
    
  }
  draw() {
    fill(random(255), random(255), random(255));
    square(this.x, this.y, this.s, this.tl, this.tr, this.bl, this.br);
  }
}

function drawRandomCircle(x=random(width), y=random(height), r=random(10,50),) {
  fill (random(255), random(255), random(255));  
  ellipse(x, y, r, r);
}