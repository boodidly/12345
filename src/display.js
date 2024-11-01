import { stdout } from 'process';
import chalk from 'chalk';
import { speakText, stopSpeech } from './voice.js';

const TYPING_SPEED = {
  min: 10,
  max: 15
};

const CHUNK_SIZE = 100; // Characters per speech chunk
let displayBuffer = [];
let lastLineCount = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearLines(count) {
  if (count > 0) {
    stdout.moveCursor(0, -count);
    stdout.clearScreenDown();
  }
}

function writeLines(lines) {
  clearLines(lastLineCount);
  lines.forEach(line => stdout.write(line + '\n'));
  lastLineCount = lines.length;
}

function wrapText(text, width) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length >= width - 2) {
      lines.push(currentLine.trim());
      currentLine = '';
    }
    currentLine += word + ' ';
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}

export async function typeText(text, voice = null) {
  const terminalWidth = stdout.columns || 80;
  let buffer = '';
  let speechBuffer = '';
  let lines = [];
  
  // Stop any existing speech
  if (voice?.enabled) {
    await stopSpeech();
  }

  for (const char of text) {
    buffer += char;
    speechBuffer += char;
    
    // Update display when we have a complete word or punctuation
    if (char === ' ' || char === '.' || char === '!' || char === '?' || char === ',') {
      lines = wrapText(buffer, terminalWidth);
      writeLines(lines);
      await sleep(TYPING_SPEED.min);
      
      // Speak in chunks for more natural flow
      if (voice?.enabled && (speechBuffer.length >= CHUNK_SIZE || /[.!?]/.test(char))) {
        const chunk = speechBuffer.trim();
        if (chunk) {
          speakText(chunk).catch(() => {});
          speechBuffer = '';
        }
      }
    }
  }
  
  // Handle any remaining text
  if (buffer) {
    lines = wrapText(buffer, terminalWidth);
    writeLines(lines);
    
    if (voice?.enabled && speechBuffer.trim()) {
      await speakText(speechBuffer.trim()).catch(() => {});
    }
  }
  
  stdout.write('\n');
}