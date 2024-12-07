var admin = require('firebase-admin');
const { getAuth } = require('firebase/auth');

var serviceAccount = require('./epickbikes-personal.json');
console.log(serviceAccount);

console.log('verifying app');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log('completed verifying app');

const verifyToken = (idToken) => {
  if (admin.apps.length === 0) {
    console.log('app is not initialised');
  } else {
    console.log('app is  initialised');
  }
  return getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const userId = decodedToken.uid;
      return { success: true, userId };
    })
    .catch((error) => {
      console.log('firebase error', error);
      return { success: false };
    });
};

const init = () => {
  // dummy function to init this file with require
};

module.exports = {
  verifyToken,
  init,
};
