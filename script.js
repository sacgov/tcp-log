let k = "";
while (k === "") {
    let data = prompt("Enter data packet : ");
    data = data.replace(" ", "");
    data = data.toLowerCase();
    let l = data.length;
    console.log("Length of the recieved data :", l);
    let header = data.slice(0, 4);
    console.log("START/HEADER :", header);
    if (header === "3a3a") {
        let packet_length = data.slice(4, 6);
        console.log("Packet length in hex :", packet_length, "in decimal :", parseInt(packet_length, 16));
        let lac = data.slice(6, 10);
        let imei = data.slice(10, 26);
        console.log("IMEI number : ", imei);
        let isn = data.slice(26, 30);
        let prot_num = data.slice(30, 32);
        console.log("Proto number :", prot_num);
        if (prot_num === "10") {
            console.log("This is a regular packet/ Heartbeat 1");
            let date = data.slice(32, 38);
            console.log("Date :", parseInt(date.slice(4, 6), 16), "/", parseInt(date.slice(2, 4), 16), "/", parseInt(date.slice(0, 2), 16));
            let time = data.slice(38, 44);
            console.log("Time hex data :", time);
            console.log("Time :", parseInt(time.slice(0, 2), 16), ":", parseInt(time.slice(2, 4), 16), ":", parseInt(time.slice(4, 6), 16));
            let lat = data.slice(44, 52);
            lat = parseInt(lat, 16) / 1800000;
            console.log("Latitude :", lat);
            let long = data.slice(52, 60);
            long = parseInt(long, 16) / 1800000;
            console.log("Longitude :", long);
            let speed = parseInt(data.slice(60, 62), 16);
            console.log("Speed :", speed);
            let course = data.slice(62, 66);
            let mnc = data.slice(66, 68);
            let cell_id = data.slice(68, 72);
            let status_byte = data.slice(72, 80);
            let gms_signal_strength = parseInt(data.slice(80, 82), 16);
            let voltage = parseInt(data.slice(82, 84), 16);
            console.log("Voltage in hex : ", data.slice(82, 84));
            console.log("Voltage of the internal battery :", voltage);
            let satelites = parseInt(data.slice(84, 86), 16);
            console.log("Number of satellites :", satelites);
            let hdop = data.slice(86, 88);
            let adc = String(parseInt(data.slice(88, 92), 16));
            console.log("ADC value : ", adc);
            let odo_index = data.slice(92, 94);
            let odo_len = data.slice(94, 96);
            let odo_reading = data.slice(96, 106);
            let rfid_index = data.slice(106, 108);
            let rfid_len = data.slice(108, 110);
            let rfid_tag = data.slice(110, 120);
            let io_index = data.slice(120, 122);
            let io_len = data.slice(122, 124);
            let io_status = data.slice(124, 132);
            let io_data = (parseInt(io_status, 16)).toString(2).padStart(32, '0');
            io_data = io_data.replace("b", "0");
            let io_variables = ["Trigger Switch", "Cam Switch", "Extra", "PAS", "Charger Status", "Headlight", "Battery Status", "Horn", "Left Brake", "Right Brake", "Left Indicator", "Right Indicator", "Sweat mode", "Ignition Sensor", "Hall effect power", "Extra 2"];
            for (let i = 0; i < io_variables.length; i++) {
                console.log(io_variables[i], " :", end = "");
                if (io_data[31 - i] === "1") {
                    console.log("ON");
                } else if (io_data[31 - i] === "0") {
                    console.log("OFF");
                } else {
                    console.log("Something else: ", io_data[31 - i]);
                }
            }
            let adc_index = data.slice(132, 134);
            let adc_len = data.slice(134, 136);
            let adc_data = data.slice(136, 148);
            let stop = data.slice(148, 152);
            if (stop === "2323") {
                console.log("DATA PARSING : Accurate");
            } else {
                console.log("DATA PARSING : Utterly Failed");
            }
        } else if (prot_num === "20") {
            console.log("This is a ENDTRIP packet");
            let date = data.slice(32, 38);
            console.log("Date :", parseInt(date.slice(4, 6), 16), "/", parseInt(date.slice(2, 4), 16), "/", parseInt(date.slice(0, 2), 16));
            let time = data.slice(38, 44);
            console.log("Time :", parseInt(time.slice(0, 2), 16), ":", parseInt(time.slice(2, 4), 16), ":", parseInt(time.slice(4, 6), 16));
            let lat = data.slice(44, 52);
            console.log("Latitude");
            let long = data.slice(52, 60);
            let speed = data.slice(60, 62);
            let course = data.slice(62, 66);
            let mnc = data.slice(66, 68);
            let cell_id = data.slice(68, 72);
            let status_byte = data.slice(72, 80);
            let gms_signal_strength = data.slice(80, 82);
            let voltage = data.slice(82, 84);
            let satelites = data.slice(84, 86);
            let hdop = data.slice(86, 88);
            let adc = data.slice(88, 92);
            let odo_index = data.slice(92, 94);
            let odo_len = data.slice(94, 96);
            let odo_reading = data.slice(96, 106);
            let rfid_index = data.slice(106, 108);
            let rfid_len = data.slice(108, 110);
            let rfid_tag = data.slice(110, 120);
            let io_index = data.slice(120, 122);
            let io_len = data.slice(122, 124);
            let io_status = data.slice(124, 132);
            let io_data = (parseInt(io_status, 16)).toString(2).padStart(32, '0');
            io_data = io_data.replace("b", "0");
            console.log(io_data);
            let adc_index = data.slice(132, 134);
            let adc_len = data.slice(134, 136);
            let adc_data = data.slice(136, 148);
            let beacon_index = data.slice(148, 150);
            let beacon_len = data.slice(150, 152);
            let no_beacon = parseInt(beacon_len, 16) / 7;
            let beacons = [];
            let k = 152;
            for (let i = 0; i < no_beacon; i++) {
                beacons.push(data.slice(k, k + 14));
                k = k + 14;
            }
            let stop = data.slice(k, k + 4);
        } else if (prot_num === "30") {
            console.log("This is a ADC packet/ Heartbeat 3");
            let date = data.slice(32, 38);
            console.log("Date :", parseInt(date.slice(4, 6), 16), "/", parseInt(date.slice(2, 4), 16), "/", parseInt(date.slice(0, 2), 16));
            let time = data.slice(38, 44);
            console.log("Time :", parseInt(time.slice(0, 2), 16), ":", parseInt(time.slice(2, 4), 16), ":", parseInt(time.slice(4, 6), 16));
            let throttle_index = data.slice(44, 46);
            let throttle_len = data.slice(46, 48);
            let throttle_data = data.slice(48, 212);
            let pas_index = data.slice(212, 214);
            let pas_len = data.slice(214, 216);
            let pas_data = data.slice(216, 298);
            let stop = data.slice(298, 300);
        }
    } else if (header === "2a2a") {
        let packet_length = data.slice(4, 6);
        let reserve = data.slice(6, 10);
        let imei = data.slice(10, 26);
        let reserve_2 = data.slice(26, 30);
        let proto_num = data.slice(30, 32);
        let date = data.slice(32, 38);
        console.log("Date :", parseInt(date.slice(4, 6), 16), "/", parseInt(date.slice(2, 4), 16), "/", parseInt(date.slice(0, 2), 16));
        let time = data.slice(38, 44);
        console.log("Time :", parseInt(time.slice(0, 2), 16), ":", parseInt(time.slice(2, 4), 16), ":", parseInt(time.slice(4, 6), 16));
        let lat = data.slice(44, 52);
        let long = data.slice(52, 60);
        let flag = data.slice(60, 62);
        let dm_event = data.slice(62, 64);
        let cmd_src_index = data.slice(64, 66);
        let dm_src_len = data.slice(66, 68);
        let src_len = parseInt(dm_src_len, 16);
        let x = 68 + (src_len * 2);
        let dm_src = data.slice(68, x);
        let cmd_data_index = data.slice(x, x + 2);
        let dm_data_len = data.slice(x + 2, x + 4);
        let data_len = parseInt(dm_data_len, 16);
        let y = x + 4 + (data_len * 2);
        let dm_data = data.slice(x + 4, y);
        let stop = data.slice(y, y + 4);
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
    }
    console.log("Press any key to exit and 'enter' to restart");
    k = prompt();
}