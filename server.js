const net = require("net");
const moment = require('moment');
const port = 7070;
const host = "127.0.0.1";

const startServer = () => {

    const sockInfo = {};
    sockInfo.listMessages = [];
  const server = net.createServer();
  server.listen(port, host, () => {
    console.log("TCP Server is running on port " + port + ".");
  });

  let sockets = [];

  server.on("connection", function (sock) {
    console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
    sockets.push(sock);

    sock.setEncoding("hex");

    sock.on("data", function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server
      const message =
        sock.remoteAddress + ":" + sock.remotePort + " - " + moment().utcOffset("+05:30").format()+" - " + data;
        sockInfo.listMessages.push(message);
      if (sockInfo.listMessages.length > 100) {
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
      console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
    });
  });

  return sockInfo
};

module.exports = {
    startServer
}
