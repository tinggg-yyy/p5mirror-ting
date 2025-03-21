let cpVoice = new p5.Speech();

function setup() {
  createCanvas(400, 400);
  cpVoice.listVoices();
  cpVoice.setVoice("Nicky");
}

function draw() {
  background(220);
}

function mousePressed() {
  let myPitch = map(mouseX, 0, width, 0, 10);
  cpVoice.setPitch(myPitch);
  cpVoice.speak("Meow meow meow");
}
