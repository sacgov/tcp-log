const {decodeJWT} = require('./jwt-decoder');


const verifyToken = (idToken) => {
  const user = decodeJWT(idToken);
  if(!user) {
    return Promise.reject('User not found');
  } else {
    return user;
  }
};
// const verifyToken = () => {}
module.exports = {
  verifyToken,
};
