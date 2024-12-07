const admin = require('firebase-admin');

const serviceAccount = require('./epickbikes-personal.json');
console.log(serviceAccount);

console.log('verifying app');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('done veriyfing');
