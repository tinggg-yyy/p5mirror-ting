let voice = new p5.Speech();
let rate = 1,
  pitch = 1;

function setup() {
  createCanvas(400, 400);
  voice.listVoices();
  voice.setVoice("Good News");
}

function draw() {
  background(220);
  text("Rate is " + rate + " and pitch is " + pitch, 10, 50);
}

function mousePressed() {
  voice.cancel();
  rate = mouseX / 200;
  pitch = mouseY / 200;
  voice.setRate(rate);
  voice.setPitch(pitch);
  voice.speak(rate + " and " + pitch);
}
