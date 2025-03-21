let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let lowNotes = ['B2', 'A#2', 'E1', 'A2', 'B1', 'F2', 'G1', 'F1', 'D#2', 'C#1', 'A#1', 'D1', 'G2', 'F#2', 
                'C2', 'G#1', 'F#1', 'C#2', 'D2', 'E2', 'C1', 'G#2', 'A#0', 'D#1', 'A1', 'B0'];
let highNotes = ['D4', 'D#3', 'B3', 'A#3', 'C4', 'F#3', 'G3', 'F3', 'C#4', 'D3', 'G#3', 'G4', 'C#3', 'A3', 
                 'A4', 'E3', 'F4', 'G#4', 'F#4', 'E4', 'C#5', 'B4', 'C5', 'A#4', 'D#4', 'C3'];

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
  let fs = fullscreen();  // 检查当前是否是全屏
  createCanvas(6400, 5600);
  textSize(32);
  textAlign(CENTER, CENTER);
  
    // 添加一个按钮用于全屏切换
  let fsButton = createButton('Fullscreen');
  fsButton.position(20, 20);
  fsButton.mousePressed(toggleFullscreen);

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
  
  // Draw first row of pages (4 pages horizontally)
  drawPage(0, 0);  
  drawPage(800, 1);
  drawPage(1600, 2);
  drawPage(2400, 3);
  drawPage(3200, 4);
  drawPage(4000, 5);
  drawPage(4800, 6);
  drawPage(5600, 7);
  
// Draw second row of pages (4 pages)
  drawPage(0, 1, 1);  
  drawPage(800, 1, 1);
  drawPage(1600, 2, 1);
  drawPage(2400, 3, 1);
  drawPage(3200, 4, 1);
  drawPage(4000, 5, 1);
  drawPage(4800, 6, 1);
  drawPage(5600, 7, 1);
  
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
  if (keyCode === ENTER) {  // 空格键
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
    handleSpecialCharacter('/', 'C4', 6);
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
      sendMidiNote(noteOut, 2);  // channel 2 对应低音区
    }

    displayedLetters.push({ letter: key, x: currentX, y: mapNoteToY(noteOut, currentStaffGroup), page: currentPage });
    currentX += 20;

    // 每行超过一定字母数后换到下一行
    if (currentX > 700) {
      currentX = 100;
      currentStaffGroup++;
      if (currentStaffGroup > 3) {
        currentStaffGroup = 0;  // 每页4组五线谱，循环使用
        currentPage++;  // 换页
      }
    }
  }
}

function handleSpecialCharacter(char, noteOut, channel) {
  // 获取前一个字母的位置
  let yPosition = displayedLetters.length > 0 ? displayedLetters[displayedLetters.length - 1].y : mapNoteToY(noteOut, currentStaffGroup);

  // 将 special character 添加到 displayedLetters 中
  displayedLetters.push({ letter: char, x: currentX, y: yPosition, page: currentPage });
  sendMidiSpecialCharacter(noteOut, channel);
  currentX += 20;
  if (currentX > 700) {
    currentX = 100;
    currentStaffGroup++;
    if (currentStaffGroup > 3) {
      currentStaffGroup = 0;
      currentPage++;
    }
  }
}

function sendMidiSpecialCharacter(note, channel) {
  if (output) {
    let noteNumber = midiNoteNumber(note);
    let velocity = 127; // 音符力度
    output.send([0x90 + channel - 1, noteNumber, velocity]); // 开启音符
    output.send([0x80 + channel - 1, noteNumber, 0], window.performance.now() + 1000); // 1秒后关闭音符
  }
}

// 播放字母对应的音符
function playNotesInOrder() {
  if (currentNoteIndex >= displayedLetters.length) return;  // 如果所有字母都播放完了则结束
  let letterData = displayedLetters[currentNoteIndex];
  let letter = letterData.letter;
  
  let noteOut;
  let delay = 250;  // 默认延时
  if (letter === '/') {
    noteOut = specialCharacters['/'];
    sendMidiNote(noteOut, 2);  // 使用特殊 channel 发送
  } else if (letter === '!') {
    noteOut = specialCharacters['!'];
    sendMidiNote(noteOut, 3);
    // 如果当前字母是 '!'，且该句以 '!' 结尾，设置更快的延时
    if (isLastLetterInSentence(currentNoteIndex)) {
      delay = 50;  // 增加播放速度，减少延时
    }
  } else if (letter === '?') {
    noteOut = specialCharacters['?'];
    sendMidiNote(noteOut, 4);
  } else if (letter === '.') {
    noteOut = specialCharacters['.'];
    sendMidiNote(noteOut, 5);
  } else {
    let index = letters.indexOf(letter);
    let nextSpecialCharIndex = findNextSpecialCharacterIndex(currentNoteIndex);
    
    if (letter === letter.toLowerCase()) {
      noteOut = highNotes[index % highNotes.length];  // 小写字母映射到高音区
    } else {
      noteOut = lowNotes[index % lowNotes.length];  // 大写字母映射到低音区
    }
    
    // 检查下一个字符是否是 "?"，并且当前字母是特殊符号之间的最后一个字母
    if (nextSpecialCharIndex !== -1 && displayedLetters[nextSpecialCharIndex].letter === '?' && isLastLetterBeforeSpecialChar(currentNoteIndex, nextSpecialCharIndex)) {
      noteOut = increasePitchByHalfOctave(noteOut);  // 升高半个八度
    }

    sendMidiNote(noteOut, letter === letter.toLowerCase() ? 3 : 2);  // channel 3 对应高音区, channel 2 对应低音区
  }
  
  currentNoteIndex++;  // 增加索引以播放下一个音符
  
  setTimeout(playNotesInOrder, delay);  // 设置延时以播放下一个音符
}

// 辅助函数：寻找下一个特殊符号的索引
function findNextSpecialCharacterIndex(startIndex) {
  for (let i = startIndex + 1; i < displayedLetters.length; i++) {
    if (specialCharacters[displayedLetters[i].letter]) {
      return i;
    }
  }
  return -1;
}

// 辅助函数：检查当前字母是否是特殊符号之间的最后一个字母
function isLastLetterBeforeSpecialChar(currentIndex, nextSpecialCharIndex) {
  for (let i = currentIndex + 1; i < nextSpecialCharIndex; i++) {
    if (letters.includes(displayedLetters[i].letter)) {
      return false;
    }
  }
  return true;
}

// 辅助函数：检查当前字母是否是句子的最后一个字母
function isLastLetterInSentence(currentIndex) {
  // 判断当前字母后面是否还有字母
  for (let i = currentIndex + 1; i < displayedLetters.length; i++) {
    if (letters.includes(displayedLetters[i].letter)) {
      return false;  // 还有其他字母
    }
  }
  return true;  // 当前字母是最后一个
}


// 辅助函数：将音高升高半个八度
function increasePitchByHalfOctave(note) {
  let noteNumber = midiNoteNumber(note);
  return midiNoteToName(noteNumber + 1);  // 增加 1 表示升高半个八度
}


// 将 MIDI 数字转换回音符名称
function midiNoteToName(noteNumber) {
  let octave = Math.floor(noteNumber / 12) - 1;
  let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let note = notes[noteNumber % 12];
  return note + octave;
}

function midiNoteNumber(note) {
  let noteMap = {
    'C0': 12, 'C#0': 13, 'D0': 14, 'D#0': 15, 'E0': 16, 'F0': 17, 'F#0': 18, 'G0': 19, 'G#0': 20, 'A0': 21, 'A#0': 22, 'B0': 23,
    'C1': 24, 'C#1': 25, 'D1': 26, 'D#1': 27, 'E1': 28, 'F1': 29, 'F#1': 30, 'G1': 31, 'G#1': 32, 'A1': 33, 'A#1': 34, 'B1': 35,
    'C2': 36, 'C#2': 37, 'D2': 38, 'D#2': 39, 'E2': 40, 'F2': 41, 'F#2': 42, 'G2': 43, 'G#2': 44, 'A2': 45, 'A#2': 46, 'B2': 47,
    'C3': 48, 'C#3': 49, 'D3': 50, 'D#3': 51, 'E3': 52, 'F3': 53, 'F#3': 54, 'G3': 55, 'G#3': 56, 'A3': 57, 'A#3': 58, 'B3': 59,
    'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65, 'F#4': 66, 'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
    'C5': 72, 'C#5': 73
  };
  return noteMap[note];
}

function sendMidiNote(note, channel) {
  if (output) {
    let noteNumber = midiNoteNumber(note);
    let velocity = 127; // 音符力度
    output.send([0x90 + channel - 1, noteNumber, velocity]); // 开启音符
    output.send([0x80 + channel - 1, noteNumber, 0], window.performance.now() + 1000); // 1秒后关闭音符
  }
}

function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);  // 切换全屏状态
}