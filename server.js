const net = require('net');

const port = 7070;
const host ='0.0.0.0';
const { parse } = require('./parser');
const Commands = require('./commands');
const { curTime } = require('./time');

const port = 7070;
const host = '0.0.0.0';

const sockInfo = {};

const processDataMessage = (message) => {
  sockInfo.push(message);
  const parsedMessage = parse(message);
  storeMessage(parsedMessage);
};

const processMessage = (connectionData) => {
  sockInfo.listMessages.push(parsedMessage);
  storeMessage(parsedMessage);
};

const startServer = () => {
  const sockInfo = {};
  sockInfo.listMessages = [];
  const server = net.createServer();
  server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
  });

  let sockets = [];

  server.on('connection', function (sock) {
    const ipInfo = (type) => {
      return {
        ip: sock.remoteAddress,
        port: sock.remotePort,
        header: type,
        dateTime: curTime(),
      };
    };
    const message = {
      rawMessage: JSON.stringify(connectionMsg),
      ...ipInfo('Connection'),
    };
    processMessage(message);

    console.log('connection message', message);

    sockets.push(sock);

    sock.setEncoding('hex');

    sock.on('data', function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server

      console.log(data);
      const message = {
        ...ipInfo('DATA'),
        ...parse(data),
      };
      console.log(message);
      updateSockMap(message.imei, sock);
      processMessage(message);
      while (sockInfo.listMessages.length > 2000) {
        sockInfo.listMessages.shift();
      }
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
      let index = sockets.findIndex(function (o) {
        return (
          o.remoteAddress === sock.remoteAddress &&
          o.remotePort === sock.remotePort
        );
      });
      if (index !== -1) sockets.splice(index, 1);
      const closeMessage = ipInfo('Closed');

      const parsedCloseMessage = {
        rawMessage: JSON.stringify(closeMessage),
        ...closeMessage,
      });
      console.log('connection closed', closeMessage);
      sockInfo.listMessages.push(closeMessage);
    });
  });

  server.on('error', (err) => {
    console.log('server err', err);
  });

  return sockInfo;
};

const sockMap = {};

const updateSockMap = (imei, sock) => {
  if (!imei) {
    console.log('imei cannot be null ', imei);
    return;
  }
  console.log('sockmap update for imei ', imei);

  sockMap[imei] = sock;
};

const sendCommand = (imei, cmd) => {
  if (!imei || !cmd) {
    console.log('imei or command is null', imei, cmd);
    return;
  }

  if (!Commands[cmd]) {
    console.log('invalid command', imei, cmd);
  }

  if (!sockMap[imei]) {
    console.log('socket not found for ', imei, cmd);
  }
  console.log('start');
  console.log(imei);
  console.log(cmd);
  console.log('end');

  sockMap[imei].write(cmd);
};

module.exports = {
  startServer,
  sockMap,
  sockInfo,
  sendCommand,
};
