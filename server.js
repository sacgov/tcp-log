const net = require('net');

const { parse } = require('./parser');
const Commands = require('./commands');
const { curTime } = require('./time');
const _ = require('lodash');
const defaultMessages = require('./defaultMessages');

const port = 7070;
const host = '0.0.0.0';

const sockInfo = {};

const MESSAGE_LIMIT = 2000;
const MESSAGE_HARD_LIMIT = 100000;

const processMessage = (parsedMessage) => {
  sockInfo.listMessages.push(parsedMessage);
  // storeMessage(parsedMessage);
};

const startServer = () => {
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
    const openMessage = ipInfo('ConnectionOpen');
    // set timeout to 20 mins
    sock.setTimeout(20*60000)

    const parsedOpenMessage = {
      rawMessage: JSON.stringify(openMessage),
      ...openMessage,
    };
    sockets.push(sock);

    sock.setEncoding('hex');

    sock.on('data', function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server

      const message = {
        ...ipInfo('DATA'),
        ...parse(data),
      };
      updateSockMap(message.imei, sock);
      processMessage(message);
      while (sockInfo.listMessages.length > MESSAGE_HARD_LIMIT) {
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
      };
      // storeMessage(parsedCloseMessage);
      console.log('connection closed', parsedCloseMessage);
    });
  });

  server.on('error', (err) => {
    console.log('server err', err);
  });
};

const sockMap = {};

const updateSockMap = (imei, sock) => {
  if (!imei) {
    console.log('imei cannot be null ', imei);
    return;
  }

  sockMap[imei] = sock;
};

const sendCommand = (imei, cmd) => {
  if (!imei || !cmd) {
    console.log(`SENDING CMD imei or command is null ${imei} ${cmd}`);
    return;
  }

  if (!sockMap[imei]) {
    console.log(
      `SENDING CMD socket not found for to write command ${imei} ${cmd}`
    );
    return;
  }
  console.log(`SENDING CMD running command on ${imei} ${cmd}`);

  sockMap[imei].write(cmd);
};

const getLatestMessages = () => {
  let sliced = sockInfo.listMessages.slice(-MESSAGE_LIMIT);
  // sliced.push(...defaultMessages);
  return sliced;
};

const getLatestMessageByIMEI = (imei) => {
  const messages = getLatestMessages();

  return _.findLast(messages, (message) => {
    return message.imei === imei && message.header === '3a3a';
  });
};
const getLatestMessageByIMEIAndValidGPS = (imei) => {
  const messages = getLatestMessages();

  return _.findLast(messages, (message) => {
    return (
      message.imei === imei && message.header === '3a3a' && message.validGPS
    );
  });
};

const getLatestMessageResponse = (imei) => {
  const message = getLatestMessageByIMEI(imei);
  if (!message) {
    return null;
  }

  const gpsValidMessage = getLatestMessageByIMEIAndValidGPS(imei);

  let lat = message.lat;
  let long = message.long;

  if (gpsValidMessage) {
    lat = gpsValidMessage.lat;
    long = gpsValidMessage.long;
  }
  return {
    lat,
    long,
    voltage: message.adc,
    batteryPercentage: message.batPercentage,
    lockStatus: message.trigger_switch,
    relayStatus: message.relayStatus,
    lastUpdatedTime: message.dateTime,
  };
};

module.exports = {
  startServer,
  sendCommand,
  getLatestMessages,
  getLatestMessageResponse,
};
