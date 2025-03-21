let syn = new p5.PolySynth();
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  //first note
  rect(0, 0, width / 4, height);
  //second note
  rect(width / 4, 0, width / 4, height);
  //third note
  rect(width / 2, 0, width / 4, height);
  //fourth note
  rect((width / 4) * 3, 0, width / 4, height);
}

function mousePressed() {
  //check which rectangle the mouse is on
  if (mouseX < width / 4) {
    syn.play("C4", 1, 0, 2); //play C4 at velocity 1, wait 0 second, and sustain for 2 seconds
  } else if (mouseX < width / 2) {
    syn.play("D4", 1, 0, 2);
  } else if (mouseX < (width / 4) * 3) {
    syn.play("E4", 1, 0, 2);
  } else {
    syn.play("F4", 1, 0, 2);
  }
}
