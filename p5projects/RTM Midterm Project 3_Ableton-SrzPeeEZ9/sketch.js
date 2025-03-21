let synth = new p5.PolySynth();
let midiIn, midiOut;

// 更新 notes 数组，分为低音区（大写字母）和高音区（小写字母）
let lowNotes = [ 'B2', 'A#2', 'E1', 'A2', 'B1', 'F2', 'G1', 'F1', 'D#2', 'C#1', 'A#1', 'D1', 'G2', 'F#2', 
             'C2', 'G#1', 'F#1', 'C#2', 'B#1', 'E2', 'C1', 'G#2', 'A#0', 'D#1', 'A1', 'B0'];
let highNotes = ['A3', 'D#3', 'B3', 'A#3', 'C4', 'F#3', 'G3', 'F3', 'C#4', 'A4', 'G#3', 'G4', 'C#3', 'D4', 
             'C3', 'E3', 'F4', 'G#4', 'F#4', 'E4', 'D3', 'B4', 'C5', 'A#4', 'D#4', 'C#5'];

let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';  // 保留大小写字母
let displayedLetters = [];
let noteIn = "";
let prg = "";

// 初始化 WebMidi.js
WebMidi.enable()
  .then(onEnabled)
  .catch((err) => alert(err));

function onEnabled() {
  if (WebMidi.inputs.length < 1) {
    document.body.innerHTML += "没有检测到MIDI设备。";
  } else {
    WebMidi.inputs.forEach((device, index) => console.log(device.name));
    WebMidi.outputs.forEach((device, index) => console.log(device.name));

    midiIn = WebMidi.inputs[0];
    midiOut = WebMidi.outputs[0];
  }
}

function setup() {
  createCanvas(800, 800);
  textSize(32);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);
  textSize(100);
  // 高音谱表
  text('𝄞', 50, 150);
   drawStaff(102);  
  // 低音谱表
  text('𝄢', 50, 300);
  drawStaff(250);  

  displayedLetters.forEach((letterData) => {
    fill(0);
    textSize(30);
    text(letterData.letter, letterData.x, letterData.y);  // 保留大小写字母
  });
}

function drawStaff(y) {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    line(100, y + i * 20, 700, y + i * 20);
  }
}

// 根据音符映射到五线谱的 Y 坐标
function mapNoteToY(note) {
  let noteToY = {
    // 低音谱表映射 (C1到B2的范围)
    'A#0': 385, 'B0': 380, 'C1': 370, 'C#1': 365, 'D1': 360, 'D#1': 355, 'E1': 350,
    'F1': 340, 'F#1': 335, 'G1': 330, 'G#1': 325, 'A1': 320,
    'A#1': 315, 'B1': 310, 'C2': 300, 'C#2': 295, 'D2': 290,
    'D#2': 285, 'E2': 280, 'F2': 270,  'F#2': 265,  'G2': 260,
    'G#2': 255,  'A2': 250,  'A#2': 245,  'B2': 240,  

    // 高音谱表映射 (A3到C5的范围)
    'C3': 200, 'C#3': 195, 'D3': 190, 'D#3': 185, 'E3': 180,
    'F3': 170, 'F#3': 165, 'G3': 160, 'G#3': 155, 'A3': 150,
    'A#3': 145, 'B3': 140, 'C4': 130, 'C#4': 125, 'D4': 120,
    'D#4': 115, 'E4': 110, 'F4': 100,  'F#4': 95,  'G4': 90,
    'G#4': 85,  'A4': 80,  'A#4': 75,  'B4': 70,  'C5': 60,
    'C#5': 55, 
  };
  return noteToY[note] || 200;  // 默认将音符映射到低音谱表
}

function keyPressed() {
  let index = letters.indexOf(key);
  if (index !== -1) {
    let noteOut, attack = 0.5;

    // 区分大写字母和小写字母并映射到不同的音符数组
    if (key === key.toLowerCase()) {
      noteOut = highNotes[index % highNotes.length];  // 小写字母映射到高音区
    } else {
      noteOut = lowNotes[index % lowNotes.length];  // 大写字母映射到低音区
    }

    displayedLetters.push({
      letter: key,
      x: random(150, 700),
      y: mapNoteToY(noteOut)
    });

    synth.play(noteOut, 0.5, 0, 0.5);

    midiOut.channels[1].playNote(noteOut, { attack });
    console.log(`发送 MIDI 音符 ${noteOut} 到 Ableton`);
  }
}

function keyReleased() {
  let index = letters.indexOf(key);
  if (index !== -1) {
    let noteOut;

    if (key === key.toLowerCase()) {
      noteOut = highNotes[index % highNotes.length];  // 停止小写字母的音符
    } else {
      noteOut = lowNotes[index % lowNotes.length];  // 停止大写字母的音符
    }

    midiOut.channels[1].stopNote(noteOut);
    console.log(`停止 MIDI 音符 ${noteOut}`);
  }
}
