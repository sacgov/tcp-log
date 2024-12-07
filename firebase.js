const admin = require('firebase-admin');
const { getAuth } = require('firebase/auth');

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

module.exports = {
  verifyToken,
};
