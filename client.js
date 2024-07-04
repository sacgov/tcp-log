const net = require("net");
const moment = require("moment");
const host = "0.0.0.0";
const port = 7070;
const { parse } = require("./parser");
const Commands = require("./commands");

const curTime = () => {
  return moment().utcOffset("+05:30").format("MMM Do, hh:mm:ss a");
};

const startClient = () => {
  const client = new net.Socket();
  client.connect(port, host, () => {
    console.log("Connected to server on port " + port + ".");
  });

  client.setEncoding("utf-8");

client.on("data", (data) => {
  console.log("Received data from server:", data);
  // Example: Display data in a UI or log it
});

  client.on("close", () => {
    console.log("Connection closed");
  });

  client.on("error", (err) => {
    console.log("Error occurred:", err);
  });

  return client;
};

const sendMessage = (client, message) => {
  if (!client ||!message) {
    console.log("Client or message is null", client, message);
    return;
  }
  client.write(message + "\n"); // add newline character to send the message
};

const sendCommand = (client, imei, cmd) => {
  if (!client ||!imei ||!cmd) {
    console.log("Client, imei or command is null", client, imei, cmd);
    return;
  }
  const command = `${imei},${cmd}`;
  sendMessage(client, command);
};

module.exports = {
  startClient,
  sendMessage,
  sendCommand,
};