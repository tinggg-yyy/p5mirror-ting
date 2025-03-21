let myRec = new p5.SpeechRec();
let myResult = "";
myRec.interimResults = true;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  text(myResult, 50, 50);
}

function mousePressed() {
  myRec.start();
  myRec.onEnd = function restart(){
    myRec.start();
  };
  myRec.onResult = showResult();
}

function showResult(){
  print(myRec.resultString);
  myResult = myRec.resultString;
}
