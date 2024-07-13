const net = require('net');
const moment = require("moment");

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

const onDataReceived = (data) => {
    console.log('Received data from server:', data);
    const parsedData = parseData(data);
    console.log('Parsed data:', parsedData);
  };

client.on('data', onDataReceived);

client.on('close', () => {
  console.log('Connection closed');
  isConnected = false;
});

client.on('error', (err) => {
  console.log('error:', err);
});


const sendCommand = (cmd) => {
    if (!isConnected) {
      console.log('Not connected to server');
      return;
    }
    client.write(cmd);
  };

// connect to the server
client.connect(port, host);

