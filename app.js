const express = require('express')
const path = require('path');
const app = express()
const helmet = require( "helmet");
const port = 3000
const host = "0.0.0.0";

const server = require('./server');
const sockInfo = server.startServer();

app.use(helmet());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get('/messages', (req, res) => {
    res.send({messages : sockInfo.listMessages});
  });

app.listen(port, host, () => {
  console.log(`Example app listening on port ${port}`)
})