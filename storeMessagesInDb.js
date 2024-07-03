const Messages = require('./db/message');
const { parse } = require('./parser');

const storeMessage = (parsedMessage) => {
  Messages.create({
    header: parsedMessage.header,
    imei: parsedMessage.imei,
    rawMessage: parsedMessage.rawMessage,
    receivedTime: parsedMessage.received_time_moment,
    error: parsedMessage.error,
    parsedMessage: parsedMessage,
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
};

module.exports = {
  storeMessage,
};
