let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let lowNotes = ['B3', 'A#3', 'E1', 'A3', 'B2', 'F2', 'G1', 'F1', 'D#2', 'C#1', 'A#2', 'D1', 'G2', 'F#2', 
                'C2', 'G#1', 'F#1', 'C#2', 'D2', 'E2', 'C1', 'G#2', 'A#1', 'D#1', 'A2', 'B1'];
let highNotes = ['A4', 'D#3', 'B4', 'A#4', 'C4', 'F#3', 'G3', 'F3', 'C#4', 'A5', 'G#3', 'G4', 'C#3', 'D4', 
                 'C3', 'E3', 'F4', 'G#4', 'F#4', 'E4', 'D3', 'B5', 'C5', 'A#5', 'D#4', 'C#5'];

let synth = new p5.PolySynth();
let displayedLetters = [];
let currentX = 100;  // 当前字母的X位置
let currentStaffGroup = 0;  // 当前五线谱组索引

let midiAccess;  // MIDI 访问对象
let output;      // MIDI 输出对象

let currentNoteIndex = 0; // 添加一个索引来跟踪当前音符

function setup() {
  createCanvas(800, 1400);  // 修改画布大小为800x1400，保持9:16比例
  textSize(32);
  textAlign(CENTER, CENTER);

  // 请求 MIDI 访问
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API not supported.");
  }
}

function onMIDISuccess(midi) {
  midiAccess = midi;
  const outputs = midiAccess.outputs;
  output = outputs.values().next().value;  // 获取第一个输出设备
  console.log("MIDI output device:", output);
}

function onMIDIFailure() {
  console.log("Failed to access MIDI devices.");
}

function draw() {
  background(255);
  
  // 绘制所有五线谱组
  for (let i = 0; i < 4; i++) {  // 修改为绘制4组五线谱，每组4行
    let yBase = 100 + i * 320;  // 每组之间的间距
    drawStaffGroup(yBase);
  }
  
  // 显示所有已输入的字母
  for (let i = 0; i < displayedLetters.length; i++) {
    let letterData = displayedLetters[i];
    fill(0);
    textSize(30);
    text(letterData.letter, letterData.x, letterData.y);  // 保留大小写字母
  }
}

function drawStaffGroup(yBase) {
  // 高音谱表
  drawStaff(yBase);
  textSize(130);
  text('𝄞', 50, yBase + 35);

  // 低音谱表
  drawStaff(yBase + 140);
  textSize(90);
  text('𝄢', 55, yBase + 185);
}

function drawStaff(y) {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    line(100, y + i * 20, 700, y + i * 20);
  }
}

function mapNoteToY(note, staffGroup) {
  let noteToY = {
    'A#1': 375, 'B1': 370, 'C1': 360, 'C#1': 355, 'D1': 350, 'D#1': 345, 'E1': 340,
    'F1': 330, 'F#1': 325, 'G1': 320, 'G#1': 315, 'A2': 310, 'A#2': 305, 'B2': 300,
    'C2': 290, 'C#2': 285, 'D2': 280, 'D#2': 275, 'E2': 270, 'F2': 260, 'F#2': 255, 'G2': 250,
    'G#2': 245, 'A3': 240, 'A#3': 235, 'B3': 230,

    // 高音谱表映射
    'C3': 200, 'C#3': 195, 'D3': 190, 'D#3': 185, 'E3': 180, 'F3': 170, 'F#3': 165, 'G3': 160, 
    'G#3': 155, 'A4': 150, 'A#4': 145, 'B4': 140, 'C4': 130, 'C#4': 125, 'D4': 120, 'D#4': 115, 
    'E4': 110, 'F4': 100, 'F#4': 95, 'G4': 90, 'G#4': 85, 'A5': 80, 'A#5': 75, 'B5': 70, 'C5': 60, 
    'C#5': 55
  };
  
  // 基于当前五线谱组的位置进行偏移
  return (noteToY[note] || 220) + staffGroup * 320;  // 每组的偏移调整为320
}

function keyPressed() {
  // 检测是否按下空格键
  if (keyCode === 32) {  // 空格键
    currentNoteIndex = 0;  // 重置索引以便从头播放
    playNotesInOrder();
    return;  // 不继续处理其他按键
  }

  // 检测是否按下 Delete 或 Backspace 键
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    if (displayedLetters.length > 0) {
      // 移除最后一个输入的字母
      displayedLetters.pop();
      
      currentX -= 20;
      if (currentX < 100) {
        currentX = 700;  // 返回上一行的末尾
        currentStaffGroup--;  // 切换回上一组五线谱
        if (currentStaffGroup < 0) currentStaffGroup = 3;  // 如果超出范围则回到最后一组
      }
    }
    return;  // 不继续处理其他按键
  }

  let index = letters.indexOf(key);

  // 处理特殊符号 "/"
  if (key === '/') {
    handleSpecialCharacter('/', 'C4', 2);
    return; // 不继续处理其他按键
  }

  // 处理特殊符号 "!"
  if (key === '!') {
    handleSpecialCharacter('!', 'D4', 3);
    return;
  }

  // 处理特殊符号 "?"
  if (key === '?') {
    handleSpecialCharacter('?', 'E4', 4);
    return;
  }

  // 处理普通字母
  if (index !== -1) {
    let noteOut;

    if (key === key.toLowerCase()) {
      noteOut = highNotes[index % highNotes.length];  // 小写字母映射到高音区
      sendMidiNote(noteOut, 127, 0);  // 小写字母发送到通道1
    } else {
      noteOut = lowNotes[index % lowNotes.length];  // 大写字母映射到低音区
      sendMidiNote(noteOut, 127, 1);  // 大写字母发送到通道2
    }

    // 计算当前字母的 Y 位置和五线谱组
    let yPosition = mapNoteToY(noteOut, currentStaffGroup);

    // 将字母推入数组，记录字母的 X 和 Y 位置
    displayedLetters.push({
      letter: key,
      x: currentX,
      y: yPosition
    });

    // 播放音符
    synth.play(noteOut, 0.5, 0, 0.5);

    // 更新 X 位置
    currentX += 20;

    // 如果 X 位置超过画布宽度，换到下一行
    if (currentX > 700) {
      currentX = 100;  // 重置 X 位置
      currentStaffGroup++;  // 切换到下一组五线谱
      if (currentStaffGroup > 3) currentStaffGroup = 0;  // 循环回第一组
    }
  }
}

// 处理特殊字符的函数
function handleSpecialCharacter(character, note, channel) {
  sendMidiNote(note, 127, channel); // 发送 MIDI 信号

  // 获取上一个字母的 Y 位置
  let lastLetterY = displayedLetters.length > 0 ? displayedLetters[displayedLetters.length - 1].y : mapNoteToY(note, currentStaffGroup);

    if (currentX == 100 && currentStaffGroup > 0) {
    lastLetterY += 320; // Move down if at the end of the line
  }
  
  // 将特殊字符推入数组
  displayedLetters.push({
    letter: character,
    x: currentX, // 当前X位置
    y: lastLetterY  // Y位置与前一个字母保持一致
  });

  // 更新 X 位置
  currentX += 20; // 增加X位置

  // 检查当前字符是否在行末，如果是，则换行
  if (currentX > 700) {
    currentX = 100;  // 重置 X 位置
    currentStaffGroup++;  // 切换到下一组五线谱
    if (currentStaffGroup > 3) currentStaffGroup = 0;  // 循环回第一组
  }
}

// 发送 MIDI 音符的函数
function sendMidiNote(note, velocity, channel) {
  if (output) {
    const noteNumber = getNoteNumber(note);
    output.send([0x90 + channel, noteNumber, velocity]);  // Note On
  }
}

// 获取 MIDI 音符编号的函数
function getNoteNumber(note) {
  const noteMap = {
    'C0': 12, 'C#0': 13, 'D0': 14, 'D#0': 15, 'E0': 16, 'F0': 17, 'F#0': 18, 'G0': 19, 
    'G#0': 20, 'A0': 21, 'A#0': 22, 'B0': 23, 'C1': 24, 'C#1': 25, 'D1': 26, 'D#1': 27, 
    'E1': 28, 'F1': 29, 'F#1': 30, 'G1': 31, 'G#1': 32, 'A1': 33, 'A#1': 34, 'B1': 35, 
    'C2': 48, 'C#2': 49, 'D2': 50, 'D#2': 51, 'E2': 52, 'F2': 53, 'F#2': 54, 'G2': 55, 
    'G#2': 56, 'A2': 57, 'A#2': 58, 'B2': 59, 'C3': 60, 'C#3': 61, 'D3': 62, 'D#3': 63, 
    'E3': 64, 'F3': 65, 'F#3': 66, 'G3': 67, 'G#3': 68, 'A3': 69, 'A#3': 70, 'B3': 71, 
    'C4': 72, 'C#4': 73, 'D4': 74, 'D#4': 75, 'E4': 76, 'F4': 77, 'F#4': 78, 'G4': 79, 
    'G#4': 80, 'A4': 81, 'A#4': 82, 'B4': 83, 'C5': 84, 'C#5': 85, 'D5': 86, 'D#5': 87, 
    'E5': 88, 'F5': 89, 'F#5': 90, 'G5': 91, 'G#5': 92, 'A5': 93, 'A#5': 94, 'B5': 95,
  };
  return noteMap[note] || 0;  // 返回音符编号或默认值
}

// 播放音符的顺序
function playNotesInOrder() {
  if (currentNoteIndex < displayedLetters.length) {
    let letterData = displayedLetters[currentNoteIndex];
    let note = letterData.letter.toUpperCase(); // 使用大写字母来映射音符
    let noteOut;

    if (lowNotes.includes(note)) {
      noteOut = lowNotes[lowNotes.indexOf(note)];
      sendMidiNote(noteOut, 127, 1);  // 小写字母发送到通道1
    } else if (highNotes.includes(note)) {
      noteOut = highNotes[highNotes.indexOf(note)];
      sendMidiNote(noteOut, 127, 2);  // 大写字母发送到通道2
    }

    synth.play(noteOut, 0.5, 0, 0.5);
    currentNoteIndex++;
    setTimeout(playNotesInOrder, 600);  // 调整音符之间的延迟
  }
}
