var admin = require('firebase-admin');
const { getAuth } = require('firebase/auth');

var serviceAccount = require('./epickbikes-personal.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = (idToken) => {
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

module.exports = {
  verifyToken,
};
