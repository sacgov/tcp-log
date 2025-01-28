const Commands = {
  UNLOCK: '**16VLT;0000;UNLOCK$__IMEI__;2024-08-13-19-10-00;0;ff0f;',
  ENDTRIP: 'VLT;0000;ENDTRIP',
  ENDTRIPPASS: 'VLT;0000;ENDTRIPPASS',
  FINDMYBIKE: 'VLT;0000;FINDMYBIKE',
  RELAYON: '**16VLT;0000;GPO2#ON$__IMEI__;2024-08-13-19-10-00;0;ff0f;',
  RELAYOFF: '**16VLT;0000;GPO2#OFF$__IMEI__;2024-08-13-19-10-00;0;ff0f;',
  RESET: 'VLT;0000;RST',
};

const constructCommand = (imei, cmd) => {
  return Commands[cmd].replace(/__IMEI__/, imei);

}

const isValidCommand = (cmd) => {
  return Commands.hasOwnProperty(cmd);
}

const valid = isValidCommand("RELAYON");

// const message = constructCommand('868019069240175','UNLOCK');
// console.log(message);

module.exports = {
  constructCommand,
  isValidCommand
};
