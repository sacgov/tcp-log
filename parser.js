let k = "";

const parse = (data) => {
  data = data.replace(/\s/g, "");
  data = data.toLowerCase();

  const header = data.slice(0, 4);

  if (header === "3a3a") {
    const packet_length = data.slice(4, 6);
    const length = parseInt(packet_length, 16);
    const lac = data.slice(6, 10);
    const imei = data.slice(10, 26);
    const isn = data.slice(26, 30);
    const protocol = data.slice(30, 32);
    let prot_10message = {}
    if (protocol === "10" || protocol === "20") {
      //regular heartbeat

      const date_hex = data.slice(32, 38);
      const date = `${parseInt(date_hex.slice(4, 6), 16)}/${parseInt(
        date_hex.slice(2, 4),
        16
      )}/${parseInt(date_hex.slice(0, 2), 16)}`;
      const time_hex = data.slice(38, 44);
      const time = `${parseInt(time_hex.slice(0, 2), 16)}:${parseInt(
        time_hex.slice(2, 4),
        16
      )}:${parseInt(time_hex.slice(4, 6), 16)}`;
      const lat = parseInt(data.slice(44, 52), 16) / 1800000;
      const long = parseInt(data.slice(52, 60), 16) / 1800000;

      const speed = parseInt(data.slice(60, 62), 16);

      const course = data.slice(62, 66);
      const mnc = data.slice(66, 68);
      const cell_id = data.slice(68, 72);
      const status_byte = data.slice(72, 80);
      const gms_signal_strength = parseInt(data.slice(80, 82), 16);
      const voltage = parseInt(data.slice(82, 84), 16);

      const satelites = parseInt(data.slice(84, 86), 16);
      const hdop = data.slice(86, 88);
      const adc = parseInt(data.slice(88, 92), 16);

      const odo_index = data.slice(92, 94);
      const odo_len = data.slice(94, 96);
      const odo_reading = data.slice(96, 106);
      const rfid_index = data.slice(106, 108);
      const rfid_len = data.slice(108, 110);
      const rfid_tag = data.slice(110, 120);
      const io_index = data.slice(120, 122);
      const io_len = data.slice(122, 124);
      const io_status = data.slice(124, 132);
      console.log(io_status)
      let io_data = parseInt(io_status, 16).toString(2).padStart(32, "0");
      console.log(io_data,"io_data")
      io_data = io_data.replace("b", "0");
        let io_variables = [
          "trigger_switch",
          "cam_switch",
          "extra_iodata",
          "PAS",
          "charger_status",
          "headlight",
          "battery_status",
          "horn",
          "left_brake",
          "right_brake",
          "left_indicator",
          "right_indicator",
          "sweat_mode",
          "ignition_sensor",
          "hall_effeect_power",
          "extra_2_iodata",
        ];
        const io_data_json = {};
        for (let i = 0; i < io_variables.length; i++) {
            let bit = io_data[31 - i]
          if ( bit === "1") {
            io_data_json[io_variables[i]] = "ON"
          } else if (bit === "0") {
            io_data_json[io_variables[i]] = "OFF"
          } else {
            
            io_data_json[io_variables[i]] = `NA : ${bit}`
          }
        }

        let adc_index = data.slice(132, 134);
        let adc_len = data.slice(134, 136);
        let adc_data = data.slice(136, 148);


        return   {
        rawMessage: data,
        imei,
        date_hex,
        date,
        time_hex,
        time,
        lat,
        long,
        speed,
        protocol,

        course,
        mnc,
        cell_id,
        status_byte,
        gms_signal_strength,
        voltage,

        satelites,
        hdop,
        adc,

        odo_index,
        odo_len,
        odo_reading,
        rfid_index,
        rfid_len,
        rfid_tag,
        io_index,
        io_len,
        io_status,
        adc_index,
        adc_len,
        adc_data,
        ...io_data_json

      };
    }
  } else if (header === "2a2a") {
    let packet_length = data.slice(4, 6);
    let reserve = data.slice(6, 10);
    let imei = data.slice(10, 26);
    let reserve_2 = data.slice(26, 30);
    let protocol = data.slice(30, 32);

    const date_hex = data.slice(32, 38);
    const date = `${parseInt(date_hex.slice(4, 6), 16)}/${parseInt(
      date_hex.slice(2, 4),
      16
    )}/${parseInt(date_hex.slice(0, 2), 16)}`;
    const time_hex = data.slice(38, 44);
    const time = `${parseInt(time_hex.slice(0, 2), 16)}:${parseInt(
      time_hex.slice(2, 4),
      16
    )}:${parseInt(time_hex.slice(4, 6), 16)}`;

    const lat = parseInt(data.slice(44, 52), 16) / 1800000;
    const long = parseInt(data.slice(52, 60), 16) / 1800000;
    let flag = data.slice(60, 62);
    let dm_event = data.slice(62, 64);
    let cmd_src_index = data.slice(64, 66);
    let dm_src_len = data.slice(66, 68);
    let src_len = parseInt(dm_src_len, 16);
    let x = 68 + src_len * 2;
    let dm_src = data.slice(68, x);
    let cmd_data_index = data.slice(x, x + 2);
    let dm_data_len = data.slice(x + 2, x + 4);
    let data_len = parseInt(dm_data_len, 16);
    let y = x + 4 + data_len * 2;
    let dm_data = data.slice(x + 4, y);

    return {
      rawMessage: data,
      packet_length,
      reserve,
      imei,
      reserve_2,
      protocol,
      date,
      time,
      lat,
      long,
      flag,
      dm_event,
      cmd_src_index,
      dm_src_len,
      src_len,
      dm_src,
      cmd_data_index,
      dm_data_len,
      data_len,
      dm_data,
    };
  } else if (header === "1a1a") {
    let imei = data.slice(4, 19);
    let vlt_msg_ver = data.slice(19, 21);
    let bot = data.slice(21, 24);
    let firm_version = data.slice(24, 30);
    let ccid = data.slice(30, 50);
    let ig_status = data.slice(50, 51);
    let main_volt = data.slice(51, 56);
    let msg = data.slice(56, data.length - 5);
    let passkey = data.slice(data.length - 7, data.length - 1);
    return {
      rawMessage: data,
      imei,
      vlt_msg_ver,
      bot,
      firm_version,
      ccid,
      ig_status,
      main_volt,
      msg,
      passkey,
    };
  } else {
    return {
      data,
      error: "header not matching",
    };
  }
};

// console.log(parse("3a3a2b00040868019069203595056810180406082f2e01e0f872086b272000000031000006000046002a0500f000010500000000080205000000000010040000000111060000000000002323"))

module.exports = {
  parse,
};
