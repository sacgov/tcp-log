const Messages = require('./db/message');

const storeMessage = (parsedMessage) => {
  Messages.create({
    header: parsedMessage.header,
    imei: parsedMessage.imei,
    rawMessage: parsedMessage.rawMessage,
    receivedTime: parsedMessage.received_time_moment,
    error: parsedMessage.error,
  })
    .then((m) => {
      console.log(m);
    })
    .catch((error) => {
      console.error('Failed to create a new record : ', error);
    });
};

module.exports = {
  storeMessage,
};
