const net = require("net");
const moment = require("moment");
const port = 7070;
const host = "0.0.0.0";
const {parse} = require('./parser')

const curTime = () => {
  return moment().utcOffset("+05:30").format()
}

const startServer = () => {
  const sockInfo = {};
  sockInfo.listMessages = [];
  const server = net.createServer();
  server.listen(port, host, () => {
    console.log("TCP Server is running on port " + port + ".");
  });

  let sockets = [];

  server.on("connection", function (sock) {
    const connectionMsg = `CONNECTED: ${curTime()} - ${sock.remoteAddress} :${sock.remotePort}`;
    console.log(connectionMsg);
    sockInfo.listMessages.push(connectionMsg);
    
    sockets.push(sock);

    sock.setEncoding("hex");

    sock.on("data", function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server

      const message = {
        ip : sock.remoteAddress,
        port : sock.remotePort ,
        ...parse(data),
        time: curTime()
      }
      // console.log(message);
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
      const closeMessage = `CLOSED: ${curTime()} - ${sock.remoteAddress} :${sock.remotePort}`
      console.log(closeMessage);
      sockInfo.listMessages.push(closeMessage)
    });
  });

  server.on('error', console.log);

  return sockInfo;
};

module.exports = {
  startServer,
};
