#!/usr/bin/env node
const net = require('net');
const { Command } = require('commander');
const program = new Command();

program
  .version('1.0.0')
  .description('powershell')
  // .option('--message', 'Include a message')
  .option('--ip <ip>', '127.0.0.1')
  .option('--port <port>',  '7070')
  .option('--delay <seconds>', 'Specify delay in seconds', '3')
  .option('--times <number>', 'Specify number of times to run', '1');

program.parse(process.argv);

// Retrieve options
const options = program.opts();

const client = new net.Socket();

client.connect(port, ip, () => {
  console.log(`Connected to server at ${ip}:${port}`);

  var count = 0;
  var interval = setInterval(function() {
    count++;
    console.log(`Run ${count}:`);
    const message = `Run ${count}: ${JSON.stringify(options)}`;

    client.write(message, () => {
      console.log(`Message sent to server: ${message}`);
    });

    if (count === timesToRun) {
      clearInterval(interval);
      client.end();
      console.log('Interval stopped after specified times.');
    }
  }, delaySeconds * 1000); // Send options every specified delay in seconds (converted to milliseconds)
});

client.on('data', (data) => {
  console.log('Received:', data.toString());
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('error:', err);
});
