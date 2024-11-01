import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';

let currentVoice = null;
let isVoiceEnabled = false;
let speechRate = 175;
let currentProcess = null;
let voices = [];

// Initialize voices
async function initVoices() {
  try {
    const python = spawn('python3', ['-c', `
import pyttsx3
engine = pyttsx3.init()
voices = engine.getProperty('voices')
for voice in voices:
    print(f"{voice.id}|{voice.name}|{voice.languages[0] if voice.languages else ''}")
`]);

    const voiceList = await new Promise((resolve, reject) => {
      let output = '';
      python.stdout.on('data', (data) => output += data.toString());
      python.stderr.on('data', (data) => console.error(data.toString()));
      python.on('close', (code) => {
        if (code === 0) resolve(output);
        else reject(new Error('Failed to get voices'));
      });
    });

    voices = voiceList.trim().split('\n').map(line => {
      const [id, name, lang] = line.split('|');
      return { id, name, lang };
    });
  } catch (error) {
    console.error(chalk.red('Error: Python TTS not available. Install with:'));
    console.error(chalk.yellow('pip install pyttsx3'));
    process.exit(1);
  }
}

export async function selectVoice() {
  if (!voices.length) await initVoices();
  
  const { voice } = await inquirer.prompt([{
    type: 'list',
    name: 'voice',
    message: 'Select a voice:',
    choices: voices.map(v => ({
      name: `${v.name} (${v.lang || 'Default'})`,
      value: v.id
    }))
  }]);
  
  currentVoice = voice;
  
  // Test the selected voice
  await speakText('Voice test successful');
  process.stdout.write(chalk.green(`\nVoice set to: ${voices.find(v => v.id === voice)?.name}\n`));
}

export function toggleVoice() {
  isVoiceEnabled = !isVoiceEnabled;
  process.stdout.write(chalk.green(`\nVoice output ${isVoiceEnabled ? 'enabled' : 'disabled'}\n`));
  if (isVoiceEnabled && !currentVoice) {
    selectVoice();
  }
  return isVoiceEnabled;
}

export function getVoiceStatus() {
  return {
    enabled: isVoiceEnabled,
    currentVoice,
    speechRate
  };
}

export function listVoices() {
  if (!voices.length) {
    process.stdout.write(chalk.yellow('Initializing voices...\n'));
    initVoices().then(() => {
      displayVoices();
    });
  } else {
    displayVoices();
  }
}

function displayVoices() {
  process.stdout.write(chalk.cyan('\nAvailable voices:\n'));
  voices.forEach(voice => {
    process.stdout.write(chalk.yellow(`${voice.name}: `) + chalk.white(`${voice.lang || 'Default'}\n`));
  });
  process.stdout.write('\n');
}

export async function stopSpeech() {
  if (currentProcess) {
    currentProcess.kill();
    currentProcess = null;
  }
}

function cleanTextForSpeech(text) {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/_{1,2}/g, '')
    .replace(/[•●■□▪▫◦○⚫⚪]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[\[\]()]/g, '')
    .trim();
}

export function speakText(text) {
  return new Promise((resolve, reject) => {
    if (!isVoiceEnabled) {
      resolve();
      return;
    }

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
      resolve();
      return;
    }

    stopSpeech().then(() => {
      const data = {
        text: cleanedText,
        rate: speechRate,
        voice: currentVoice
      };

      currentProcess = spawn('python3', ['src/voice.py', JSON.stringify(data)]);
      
      currentProcess.stderr.on('data', (data) => {
        console.error(chalk.red('TTS Error:', data.toString()));
      });

      currentProcess.on('close', (code) => {
        currentProcess = null;
        if (code === 0) resolve();
        else reject(new Error('TTS process failed'));
      });
    });
  });
}