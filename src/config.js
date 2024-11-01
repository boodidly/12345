import chalk from 'chalk';

export const OLLAMA_API = 'http://localhost:11434/api';
export const MODEL = 'llama3.2:1b';

export const VOICES = {
  'Default': { description: 'Default male voice', espeakVoice: 'en' },
  'Female': { description: 'Female voice', espeakVoice: 'en+f3' },
  'Male (UK)': { description: 'British male voice', espeakVoice: 'en-gb' },
  'Female (UK)': { description: 'British female voice', espeakVoice: 'en-gb+f3' },
  'Whisper': { description: 'Soft whispered voice', espeakVoice: 'whisper' }
};

export const BANNER = `
${chalk.white('═══╗')}  ${chalk.red('▓▓▓')}  ${chalk.white('╔═══')}
${chalk.red('░░░║')}  ${chalk.white('|||')}  ${chalk.red('║░░░')}
${chalk.white('───╢')} ${chalk.red('▒▒▒▒▒')} ${chalk.white('╟───')}
${chalk.red('▒▒▒▒')}${chalk.white('┃')}${chalk.red('░░░░░')}${chalk.white('┃')}${chalk.red('▒▒▒▒')}
${chalk.white('╾──╼')}${chalk.red('┇')}${chalk.white('═════')}${chalk.red('┇')}${chalk.white('╾──╼')}
${chalk.red('▓▓')}${chalk.white('╾───┨')}${chalk.red('▓▓▓')}${chalk.white('╟───╼')}${chalk.red('▓▓')}
${chalk.white('══╾')}${chalk.red('░░░')}${chalk.white('┃')}${chalk.red('███')}${chalk.white('┃')}${chalk.red('░░░')}${chalk.white('╼══')}
${chalk.red('▒▒')}${chalk.white('╾───┨')}${chalk.red('▓▓▓')}${chalk.white('╟───╼')}${chalk.red('▒▒')}
${chalk.white('───')}${chalk.red('┇')}${chalk.white('═════')}${chalk.red('┇')}${chalk.white('───')}`;

export const COMMANDS = {
  exit: 'exit',
  voice: 'voice',
  voices: 'voices',
  help: 'help'
};