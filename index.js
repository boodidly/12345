import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { BANNER, MODEL, COMMANDS } from './src/config.js';
import { toggleVoice, listVoices, selectVoice, getVoiceStatus } from './src/voice.js';
import { checkOllamaServer, generateResponse } from './src/ollama.js';
import { typeText } from './src/display.js';

const spinner = ora({
  text: chalk.cyan('Thinking...'),
  color: 'yellow',
  isEnabled: true,
  stream: process.stdout
});

async function chat() {
  console.clear();
  process.stdout.write(BANNER + '\n');
  process.stdout.write(chalk.cyan.bold('🤖 Ollama Chat') + chalk.green(` (${MODEL})`) + chalk.dim(' - Type "help" for commands\n\n'));

  await checkOllamaServer();

  while (true) {
    const { prompt } = await inquirer.prompt([{
      type: 'input',
      name: 'prompt',
      message: chalk.blue('You'),
      prefix: ''
    }]);

    if (!prompt) continue;
    const cmd = prompt.toLowerCase().trim();
    
    switch (cmd) {
      case 'exit':
        process.stdout.write(chalk.cyan('👋 Goodbye!\n'));
        process.exit(0);
        
      case 'voice':
        toggleVoice();
        if (getVoiceStatus().enabled) await selectVoice();
        continue;
        
      case 'voices':
        listVoices();
        continue;
        
      case 'help':
        Object.entries(COMMANDS).forEach(([cmd, desc]) => 
          cmd !== 'exit' && process.stdout.write(chalk.yellow(`${cmd}`) + chalk.white(`: ${desc}\n`))
        );
        continue;
        
      default:
        spinner.start();
        try {
          const response = await generateResponse(prompt);
          spinner.stop();
          process.stdout.write(chalk.yellow('AI: '));
          await typeText(response, getVoiceStatus());
        } catch (error) {
          spinner.stop();
          process.stdout.write(chalk.red('❌ ') + error.message + '\n');
        }
    }
  }
}

process.on('SIGINT', () => {
  spinner.stop();
  process.stdout.write(chalk.cyan('\n👋 Goodbye!\n'));
  process.exit(0);
});

chat();