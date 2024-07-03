const Messages = require('./db/message');
<<<<<<< HEAD
const { parse } = require('./parser');
=======
>>>>>>> 3505e06 (changes)

const storeMessage = (parsedMessage) => {
  Messages.create({
    header: parsedMessage.header,
    imei: parsedMessage.imei,
    rawMessage: parsedMessage.rawMessage,
    receivedTime: parsedMessage.received_time_moment,
    error: parsedMessage.error,
  })
    .then((m) => {
      console.log('stored the message ', m);
    })
    .catch((error) => {
      console.error('Failed to create a new record : ', error);
    });
};

module.exports = {
  storeMessage,
};
