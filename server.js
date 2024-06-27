const net = require("net");
const moment = require("moment");
const port = 7070;
const host = "0.0.0.0";
const { parse } = require("./parser");
const Commands = require("./commands");

const curTime = () => {
  return moment().utcOffset("+05:30").format("MMM Do, hh:mm:ss a");
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
    const connectionMsg = ipInfo("Connection");
    sockInfo.listMessages.push({
      rawMessage: JSON.stringify(connectionMsg),
      ...connectionMsg,
    });

    sockets.push(sock);

    sock.setEncoding('hex');

    sock.on('data', function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server

      console.log('received data', data);
      const message = {
        ...ipInfo('DATA'),
        ...parse(data),
      };
      console.log('parsed data', message);
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

  server.on('error', console.log);

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
  console.log('running command on ', { imei, cmd });

  sockMap[imei].write(cmd);
};

module.exports = {
  startServer,
  sockMap,
  sockInfo,
  sendCommand,
};
