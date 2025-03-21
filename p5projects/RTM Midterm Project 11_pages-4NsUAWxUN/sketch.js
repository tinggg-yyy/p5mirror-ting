let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let lowNotes = ['B2', 'A#2', 'E1', 'A2', 'B1', 'F2', 'G1', 'F1', 'D#2', 'C#1', 'A#1', 'D1', 'G2', 'F#2', 
                'C2', 'G#1', 'F#1', 'C#2', 'D2', 'E2', 'C1', 'G#2', 'A#0', 'D#1', 'A1', 'B0'];
let highNotes = ['D4', 'D#3', 'B3', 'A#3', 'C4', 'F#3', 'G3', 'F3', 'C#4', 'A4', 'G#3', 'G4', 'C#3', 'A3', 
                 'D3', 'E3', 'F4', 'G#4', 'F#4', 'E4', 'C#5', 'B4', 'C5', 'A#4', 'D#4', 'C3'];

let specialCharacters = { '!': 'D4', '?': 'E4', '/': 'C4' , '.':'F4'};
let synth = new p5.PolySynth();
let displayedLetters = [];
let currentX = 100;  // 当前字母的X位置
let currentStaffGroup = 0;  // 当前五线谱组索引
let currentPage = 0;  // 当前页数

let midiAccess;  // MIDI 访问对象
let output;      // MIDI 输出对象

let currentNoteIndex = 0; // 添加一个索引来跟踪当前音符

function setup() {
  createCanvas(1600, 1400);  // 修改画布大小为1600x1400，适应左右两页
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
  
  // 绘制左侧页面的五线谱
  drawPage(0, 0);
  
  // 绘制右侧页面的五线谱
  drawPage(800, 1);
  
  // 显示所有已输入的字母
  for (let i = 0; i < displayedLetters.length; i++) {
    let letterData = displayedLetters[i];
    fill(0);
    textSize(30);
    text(letterData.letter, letterData.x + (letterData.page * 800), letterData.y);  // 处理每页的X位置偏移
  }
}

function drawPage(xOffset, page) {
  for (let i = 0; i < 4; i++) {  // 每页绘制4组五线谱
    let yBase = 100 + i * 320;  // 每组之间的间距
    drawStaffGroup(yBase, xOffset, page);
  }
}

function drawStaffGroup(yBase, xOffset, page) {
  // 高音谱表
  drawStaff(yBase, xOffset);
  textSize(130);
  text('𝄞', xOffset + 50, yBase + 35);

  // 低音谱表
  drawStaff(yBase + 140, xOffset);
  textSize(90);
  text('𝄢', xOffset + 55, yBase + 185);
}

function drawStaff(y, xOffset) {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    line(xOffset + 100, y + i * 20, xOffset + 700, y + i * 20);
  }
}

function mapNoteToY(note, staffGroup) {
  let noteToY = {
    'A#0': 375, 'B0': 370, 'C1': 360, 'C#1': 355, 'D1': 350, 'D#1': 345, 'E1': 340,
    'F1': 330, 'F#1': 325, 'G1': 320, 'G#1': 315, 'A1': 310, 'A#1': 305, 'B2': 300,
    'C2': 290, 'C#2': 285, 'D2': 280, 'D#2': 275, 'E2': 270, 'F2': 260, 'F#2': 255, 'G2': 250,
    'G#2': 245, 'A2': 240, 'A#2': 235, 'B2': 230,

    // 高音谱表映射
    'C3': 200, 'C#3': 195, 'D3': 190, 'D#3': 185, 'E3': 180, 'F3': 170, 'F#3': 165, 'G3': 160, 
    'G#3': 155, 'A3': 150, 'A#3': 145, 'B3': 140, 'C4': 130, 'C#4': 125, 'D4': 120, 'D#4': 115, 
    'E4': 110, 'F4': 100, 'F#4': 95, 'G4': 90, 'G#4': 85, 'A4': 80, 'A#4': 75, 'B4': 70, 'C5': 60, 
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
  
  // 处理特殊符号 "."
  if (key === '.') {
    handleSpecialCharacter('.', 'F4', 5);  // F4 对应 channel 5
    return; // 不继续处理其他按键
  }

  // 处理普通字母
  if (index !== -1) {
    let noteOut;

    if (key === key.toLowerCase()) {
      noteOut = highNotes[index % highNotes.length];  // 小写字母映射到高音区
      sendMidiNote(noteOut, 3); // channel 3 对应高音区
    } else {
      noteOut = lowNotes[index % lowNotes.length];  // 大写字母映射到低音区
      sendMidiNote(noteOut, 2); // channel 2 对应低音区
    }

    displayedLetters.push({ letter: key, x: currentX, y: mapNoteToY(noteOut, currentStaffGroup), page: currentPage });  // 记录当前页数
    
    currentX += 20;
    if (currentX > 700) {  // 当到达右侧边界时
      currentX = 100;  // 回到左侧
      currentStaffGroup++;  // 切换到下一组五线谱
      if (currentStaffGroup >= 4) {  // 当所有五线谱组都填满时
        currentStaffGroup = 0;  // 重置五线谱组索引
        currentPage++;  // 跳到下一页
      }
    }
  }
}

function handleSpecialCharacter(symbol, note, channel) {
  let previousY = displayedLetters.length > 0 ? displayedLetters[displayedLetters.length - 1].y : mapNoteToY(note, currentStaffGroup);  // 获取前一个字母的 y 位置，如果没有前一个字母则使用当前五线谱组的默认 y 位置
  
  displayedLetters.push({ letter: symbol, x: currentX, y: previousY, page: currentPage });  // 使用前一个字母的 y 位置
  sendMidiNote(note, channel);  // 发送 MIDI 信号
  currentX += 20;
  if (currentX > 700) {  // 检查是否超出右侧边界
    currentX = 100;  // 回到左侧
    currentStaffGroup++;  // 切换到下一组五线谱
    if (currentStaffGroup >= 4) {  // 当所有五线谱组都填满时
      currentStaffGroup = 0;  // 重置五线谱组索引
      currentPage++;  // 跳到下一页
    }
  }
}


function sendMidiNote(note, channel) {
  if (output) {
    let noteNumber = midiNoteNumber(note);
    output.send([0x90 + channel, noteNumber, 100]);  // 发送 note on
    setTimeout(() => {
      output.send([0x80 + channel, noteNumber, 0]);  // 发送 note off
    }, 500);
  }
}

function playNotesInOrder() {
  if (currentNoteIndex >= displayedLetters.length) return;  // 如果所有字母都播放完了则结束
  let letterData = displayedLetters[currentNoteIndex];
  let letter = letterData.letter;
  
  let noteOut;
  if (letter === '/') {
    noteOut = specialCharacters['/'];
    sendMidiNote(noteOut, 2);  // 使用特殊 channel 发送
  } else if (letter === '!') {
    noteOut = specialCharacters['!'];
    sendMidiNote(noteOut, 3);
  } else if (letter === '?') {
    noteOut = specialCharacters['?'];
    sendMidiNote(noteOut, 4);
  } else if (letter === '.') {
    noteOut = specialCharacters['.'];
    sendMidiNote(noteOut, 5);
  } else {
    let index = letters.indexOf(letter);
    if (letter === letter.toLowerCase()) {
      noteOut = highNotes[index % highNotes.length];  // 小写字母映射到高音区
      sendMidiNote(noteOut, 3); // channel 3
    } else {
      noteOut = lowNotes[index % lowNotes.length];  // 大写字母映射到低音区
      sendMidiNote(noteOut, 2); // channel 2
    }
  }
  
  currentNoteIndex++;  // 增加索引以播放下一个音符
  
  setTimeout(playNotesInOrder, 1000);  // 设置延时以播放下一个音符
}

function midiNoteNumber(note) {
  let octave = parseInt(note.slice(-1));
  let key = note.slice(0, -1);
  let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes.indexOf(key) + (octave + 1) * 12;
}
