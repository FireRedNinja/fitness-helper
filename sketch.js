function setup(){
  createCanvas(600,600);
  background(51);
  button = createButton("Test Button")
  button.mousePressed(changeBackground);
}
function draw(){
}

function changeBackground(){
  colour = random(0,255);
  colour2 = random(0,255);
  colour3 = random(0,255);
  background(colour,colour2,colour3);
}
