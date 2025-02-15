const { jwtDecode } = require('jwt-decode');

const token = 'eyJ0eXAiO.../// jwt token';

const decodeJWT = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.log('jwt decode failed', e);
    return null;
  }
};

module.exports = {
  decodeJWT,
};
