
button = new button();

function setup(){
  button.onclick(changeBackground());

}
function draw(){

}

function changeBackground(){
  colour = random(0,255);
  background(colour);
}
