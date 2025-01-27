const Commands = {
  UNLOCK: '**16VLT;0000;UNLOCK$__IMEI__;2024-08-13-19-10-00;0;ff0f;',
  ENDTRIP: 'VLT;0000;ENDTRIP',
  ENDTRIPPASS: 'VLT;0000;ENDTRIPPASS',
  FINDMYBIKE: 'VLT;0000;FINDMYBIKE',
  RELAYON: 'VLT;0000;GPO2#ON',
  RELAYOFF: 'VLT;0000;GPO2#OFF',
  RESET: 'VLT;0000;RST',
};

const constructCommand = (imei, cmd) => {
  return Commands[cmd].replace(/__IMEI__/, imei);

}

module.exports = {
  constructCommand
};
