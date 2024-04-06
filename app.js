const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const port = 3000;
const host = "0.0.0.0";

const server = require("./server");
const { sampleMessages } = require("./sampleMessages");
const sockInfo = server.startServer();

// app.use(helmet());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/table", (req, res) => {
  res.sendFile(path.join(__dirname, "table.html"));
});

app.get("/messages", (req, res) => {
  let messages = sockInfo.listMessages;
  // messages = sampleMessages;
  res.send({ messages });
});
app.use((err, req, res, next) => {
  res.send({ error: "yes" });
});

app.listen(port, host, () => {
  console.log(`App listening on port ${port}`);
});

process.on("uncaughtException", (err) => {
  console.log("whoops! there was an unhandled exception", err);
});
process.on("unhandledRejection", function (reason, p) {
  console.log("whoops! there was an unhandled rejection", err);
});
