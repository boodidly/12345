import fetch from 'node-fetch';
import chalk from 'chalk';
import { OLLAMA_API, MODEL } from './config.js';

export async function checkOllamaServer() {
  try {
    const response = await fetch(`${OLLAMA_API}/tags`);
    if (!response.ok) throw new Error('Ollama server not responding');
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Error: Ollama server is not running'));
    console.error(chalk.yellow('ℹ️  Make sure Ollama is installed and running with: ollama run llama3.2:1b'));
    process.exit(1);
  }
}

export async function generateResponse(prompt) {
  const response = await fetch(`${OLLAMA_API}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}