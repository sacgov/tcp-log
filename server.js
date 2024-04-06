const net = require("net");
const moment = require("moment");
const port = 7070;
const host = "0.0.0.0";
const { parse } = require("./parser");

const curTime = () => {
  return moment().utcOffset("+05:30").format('MMM Do, hh:mm:ss a');;
};

const startServer = () => {
  const sockInfo = {};
  sockInfo.listMessages = [];
  const server = net.createServer();
  server.listen(port, host, () => {
    console.log("TCP Server is running on port " + port + ".");
  });

  let sockets = [];

  server.on("connection", function (sock) {
    const ipInfo = (type) => {
      return {
        ip: sock.remoteAddress,
        port: sock.remotePort,
        header: type,
        dateTime: curTime(),
      };
    };
    const connectionMsg = ipInfo("Connection");
    sockInfo.listMessages.push( {rawMessage : JSON.stringify(connectionMsg), ...connectionMsg});

    sockets.push(sock);

    sock.setEncoding("hex");

    sock.on("data", function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server

      const message = {
        ...ipInfo("DATA"),
        ...parse(data),
      };
      sockInfo.listMessages.push(message);
      while (sockInfo.listMessages.length > 100) {
        sockInfo.listMessages.shift();
      }
    });

    // Add a 'close' event handler to this instance of socket
    sock.on("close", function (data) {
      let index = sockets.findIndex(function (o) {
        return (
          o.remoteAddress === sock.remoteAddress &&
          o.remotePort === sock.remotePort
        );
      });
      if (index !== -1) sockets.splice(index, 1);
      const closeMessage = ipInfo("Closed");
      
    sockInfo.listMessages.push( {rawMessage : JSON.stringify(closeMessage), ...closeMessage});
      sockInfo.listMessages.push(closeMessage);
    });
  });

  server.on("error", console.log);

  return sockInfo;
};

module.exports = {
  startServer,
};
