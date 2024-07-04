const net = require('net');
const { parse } = require('./parser');
const Commands = require('./commands');
const { curTime } = require('./time');

const port = 7070;
const host = '0.0.0.0'; 

const client = new net.Socket();

let isConnected = false;

client.setEncoding('hex');

client.on('connect', () => {
  console.log('Connected to server');
  isConnected = true;
  const connectionMsg = {
    type: 'connection',
    imei: '1234567890', // replace with your device's IMEI
  };
  client.write(JSON.stringify(connectionMsg));
});

client.on('data', (data) => {
  console.log('Received data from server:', data);
  const parsedData = parseData(data);
  console.log('Parsed data:', parsedData);
});

client.on('close', () => {
  console.log('Connection closed');
  isConnected = false;
});

client.on('error', (err) => {
  console.log('Error:', err);
});

function parseData(data) {
  // implement your data parsing logic here
  return {
    type: 'data',
    imei: '1234567890', 
    data: data.toString(),
  };
}

function sendCommand(cmd) {
  if (!isConnected) {
    console.log('Not connected to server');
    return;
  }
  client.write(cmd);
}

// connect to the server
client.connect(port, host);

// send a command to the server
setTimeout(() => {
  sendCommand('COMMAND_1');
}, 2000);

// close the connection
setTimeout(() => {
  client.destroy();
}, 5000);