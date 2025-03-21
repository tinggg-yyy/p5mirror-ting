let rec = new p5.SpeechRec();
let result = "Click on the canvas to start speech recognition.";

let synth = new p5.PolySynth();

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  text(result, 10, 50);
}

function mousePressed() {
  rec.start();
  rec.onResult = checkResult;
  rec.onEnd = function restart() {
    rec.start();
  };
}
function checkResult() {
  result = rec.resultString.toLowerCase();
  userStartAudio();
  if (result.indexOf("cat") !== -1) {
    synth.play("C4", 1, 0, 2);
  }
  if (result.indexOf("dog") !== -1) {
    synth.play("D4", 1, 0, 2);
  }
  if (result.indexOf("elephant") !== -1) {
    synth.play("E4", 1, 0, 2);
  }
}
