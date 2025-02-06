const { jwtDecode } = require('jwt-decode');

const token = 'eyJ0eXAiO.../// jwt token';

const decodeJWT = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log(decoded);
    return decoded;
  } catch (e) {
    console.log('jwt decode failed', e);
    return null;
  }
};

module.exports = {
  decodeJWT,
};
