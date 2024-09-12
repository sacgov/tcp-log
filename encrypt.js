const crypto = require('crypto');
const { json } = require('sequelize');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(
  '890826cd090fe1c76c63080546f787acc3b79a565970af757787dbbfc9dbc70e',
  'hex'
);
const iv = Buffer.from('480c0f6129aa3672588bccfd8e747963', 'hex');

const cipher = crypto.createCipheriv(algorithm, key, iv);
const decipher = crypto.createDecipheriv(algorithm, key, iv);

const genKey = (userId, validTill) => {
  const payload = JSON.stringify({ userId, validTill });
  return cipher.update(payload, 'utf8', 'hex') + cipher.final('hex');
};

const getUserIDfromKey = (encryptText) => {
  try {
    const decryptedText =
      decipher.update(encryptText, 'hex', 'utf8') + decipher.final('utf8');
    const decryptedPayload = JSON.parse(decryptedText);
    if (moment().unix() > decryptedPayload.validTill) {
      return { success: false };
    }
    return {
      success: true,
      userId: decryptedPayload.userId,
    };
  } catch (e) {
    return { success: false };
  }
};

module.exports = {
  genKey,
  getUserIDfromKey,
};
