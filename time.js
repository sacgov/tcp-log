const moment = require('moment');
const curTime = () => {
  return moment().utcOffset('+05:30').format('MMM Do, hh:mm:ss a');
};

module.exports = {
  curTime,
};
