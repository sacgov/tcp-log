const net = require("net");
const moment = require("moment");
const host = "0.0.0.0";
const port = 7070;

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
    console.log("Received data from server:", data.toString());
    handleResponse(data.toString()); // handle the response from the server
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

const handleResponse = (response) => {
  // handle the response from the server
  if (response.startsWith("Server response: ")) {
    console.log("Server response:", response.substring(15)); // remove the prefix
  } else {
    console.log("Unknown response:", response);
  }
};

// Start the client
const client = startClient();

setTimeout(() => {
  sendMessage(client, "Hello from client!");
}, 2000);

setTimeout(() => {
  sendCommand(client, "1234567890", "GET_LOCATION");
}, 4000);

module.exports = {
  startClient,
  sendMessage,
  sendCommand,
};