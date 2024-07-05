#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

program
  .version('1.0.0')
  .description('Sample CLI tool')
  .option('--message', 'Include a message')
  .option('--ip <ip>', '192.68.45.39')
  .option('--port <port>', '7070')
  .option('--delay <seconds>', 'Specify delay in seconds')
  .option('--times <number>', 'Specify number of times to run');

program.parse(process.argv);

// Retrieve options
const options = program.opts();

const delaySeconds = options.delay ? parseInt(options.delay) : 3;
const timesToRun = options.times ? parseInt(options.times) : 1;

console.log('Initial options:');
console.log(options);

// Execute the script logic
var count = 0;
var interval = setInterval(function() {
  count++;
  console.log(`Run ${count}:`);
  console.log(options);

  if (count === timesToRun) {
    clearInterval(interval);
    console.log('Interval stopped after specified times.');
  }
}, delaySeconds * 1000); // Print options every specified delay in seconds (converted to milliseconds)
