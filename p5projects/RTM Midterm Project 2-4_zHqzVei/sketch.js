let letters = 'abcdefghijklmnopqrstuvwxyz';
let notes = ['A3', 'D#3', '', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 
             'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C2', 'D2', 'E2', 'F2', 'G2'];
let synth;
let displayedLetters = []; // 用于存储已输入的字母

function setup() {
  createCanvas(800, 400);
  synth = new p5.PolySynth();

  textSize(32);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  // 画高音谱表
  drawStaff(100);
  text('𝄞', 50, 150);

  // 画低音谱表
  drawStaff(250);
  text('𝄢', 50, 300);

  // 显示所有已输入的字母
  for (let i = 0; i < displayedLetters.length; i++) {
    let letterData = displayedLetters[i];
    fill(0);
    text(letterData.letter.toUpperCase(), letterData.x, letterData.y);
  }
}

function drawStaff(y) {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    line(100, y + i * 20, 700, y + i * 20);
  }
}

function keyPressed() {
  let index = letters.indexOf(key.toLowerCase());
  if (index !== -1) {
    let note = notes[index];
    let yPosition = mapNoteToY(index);
    let xPosition = random(150, 700); // 随机生成字母的X位置

    // 把字母及其位置存入数组
    displayedLetters.push({
      letter: key,
      x: xPosition,
      y: yPosition
    });

    // 播放对应音符
    synth.play(note, 0.5, 0, 0.5);
  }
}

function mapNoteToY(index) {
  if (index < 14) { // 高音谱表 (C4 - B5)
    return map(index, 0, 13, 160, 100);
  } else { // 低音谱表 (C2 - B3)
    return map(index, 14, 25, 310, 250);
  }
}