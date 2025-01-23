"""To parse the recieved server data"""
k=""
while k=="":    
    data=input("Enter data packet : ")
    data=data.lower()
    print(data)
    l=len(data)
    print("Length of the recieved data :", l)
    header=data[0:4] #header=3a3a or 2a2a or 1a1a
    print("START/HEADER :",header)
    if header=="3a3a":
        packet_length=data[4:6]
        print("Packet length in hex :",packet_length, "in decimal :", int(packet_length,16))
        lac=data[6:10]
        imei=data[10:26] #imei number
        print("IMEI number : ",imei)
        isn=data[26:30]
        print("Information Serial Number : ",isn)
        prot_num=data[30:32] #protocol number
        print("Proto number :", prot_num)
        if prot_num=="10" or prot_num=="50":
            if prot_num=="50":
                print("TOWING ALERT!!!")
            print("This is a regular packet/ Heartbeat 1")
            date=data[32:38] # date in hex (YYMMDD)
            print("Date :", int(date[4:6],16),"/",int(date[2:4],16),"/",int(date[0:2],16)) #date (DD/MM/YY)
            time=data[38:44] # time in hex
            print("Time hex data :", time)
            print("Time :", int(time[0:2],16),":",int(time[2:4],16),":",int(time[4:6],16)) #time HH:MM:SS
            lat=data[44:52] #latitude in hex 
            lat=int(lat,16)/1800000 #latitude after conversion
            print("Latitude :",lat)
            long=data[52:60] #longitude in hex
            long=int(long,16)/1800000 #longitude after conversion
            print("Longitude :", long)
            speed=int(data[60:62],16)
            print("Speed :",speed)
            course=data[62:66]
            mnc=data[66:68]
            cell_id=data[68:72]
            status_byte=data[72:80]
            print("status byte : ",status_byte)
            status_data=bin(int(status_byte,16)).zfill(32)
            status_data=status_data.replace("b","0")
            print("Status byte data in binary : ",status_data)
            gms_signal_strength=int(data[80:82],16)
            print("Signal Strength :",gms_signal_strength)
            voltage=int(data[82:86],16) #internal volatge converted from hex to decimal
            print("Voltage in hex : ", data[82:86])
            print("Voltage of the internal battery :",voltage)
            satelites=int(data[86:88],16)
            print("Number of satellites :",satelites)
            hdop=data[88:90]
            adc=str(int(data[90:94],16)) #external voltage converted from hex to decimal (in millivolts)
            print("ADC value : ",adc)
            odo_index=data[94:96]
            odo_len=data[96:98]
            odo_reading= data[98:108]
            print("Odo reading : ",odo_reading)
            rfid_index=data[108:110]
            rfid_len=data[110:112]
            rfid_tag=data[112:122]
            io_index=data[122:124]
            io_len=data[124:126]
            io_status=data[126:134]
            io_data=bin(int(io_status,16)).zfill(32) #binary data in 32 bits #hex is converted to binary but keeps "b" in the result
            io_data=io_data.replace("b","0") #replaces "b" with "0", if there is "b" in the result
            print("io data: ",io_data)
            io_variables=["Trigger Switch","Cam Switch","Extra","PAS","Charger Status","Headlight","Battery Status","Horn","Left Brake","Right Brake","Left Indicator","Right Indicator","Sweat mode","Ignition Sensor","Hall effect power","Extra 2"]
            for i in range(len(io_variables)): #last 16bits are assigned to these parameters from backwards
                print(io_variables[i]," :",end="")
                if io_data[31-i]=="1":
                    print("ON")
                elif io_data[31-i]=="0":
                    print("OFF")
                else:
                    print("Something else: ",io_data[31-i])
            adc_index=data[134:136]
            adc_len=data[136:138]
            adc_data=data[138:150]
            stop=data[150:154]
            if stop=="2323": #to check if the parsing data is accurate or not
                print("DATA PARSING : Accurate")
            else:
                print("DATA PARSING : Utterly Failed")
            
    
        elif prot_num=="20":
            print("This is a ENDTRIP packet")
            date=data[32:38] # date in hex
            print("Date :", int(date[4:6],16),"/",int(date[2:4],16),"/",int(date[0:2],16)) # date DD/MM/YY
            time=data[38:44]
            print("Time :", int(time[0:2],16),":",int(time[2:4],16),":",int(time[4:6],16)) # time HH:MM:SS
            lat=data[44:52]
            lat=int(lat,16)/1800000
            print("Latitude :",lat)
            long=data[52:60]
            long=int(long,16)/1800000
            print("Lomgitude :", long)
            speed=data[60:62]
            course=data[62:66]
            mnc=data[66:68]
            cell_id=data[68:72]
            status_byte=data[72:80]
            gms_signal_strength=data[80:82]
            voltage=data[82:84]
            satelites=data[84:86]
            hdop=data[86:88]
            adc=data[88:92]
            odo_index=data[92:94]
            odo_len=data[94:96]
            odo_reading= data[96:106]
            rfid_index=data[106:108]
            rfid_len=data[108:110]
            rfid_tag=data[110:120]
            io_index=data[120:122]
            io_len=data[122:124]
            io_status=data[124:132]
            io_data=bin(int(io_status,16)).zfill(32) # only trigger switch and charger status are required
            io_data=io_data.replace("b","0") 
            adc_index=data[132:134]
            adc_len=data[134:136]
            adc_data=data[136:148]
            beacon_index=data[148:150]
            beacon_len=data[150:152]
            no_beacon=int(int(beacon_len,16)/7) #number of beacons, each beacon has 7 bytes
            print("Number of beacons: ",no_beacon)
            beacons=[]
            k=152
            for i in range(no_beacon):
                beacons.append(data[k:k+14]) #first byte in every beacon represents signal strength in hex
                k=k+14
                
            print("S.No."," ","Strength","   ","Beacon Id")
                
            for i in beacons:
                print(beacons.index(i)+1,"      ", end="")
                s=i[0:2]
                s=int(s,16)
                print(s,"          ",end="")
                bid=i[2:14]
                print(bid)
            stop=data[k:k+4] #if stop==2323, parsing is accurate
        
        elif prot_num=="30":
            print("This is a ADC packet/ Heartbeat 3")
            date=data[32:38] #date in hex
            print("Date :", int(date[4:6],16),"/",int(date[2:4],16),"/",int(date[0:2],16)) #date DD/MM/YY
            time=data[38:44] #time in hex
            print("Time :", int(time[0:2],16),":",int(time[2:4],16),":",int(time[4:6],16)) #time HH:MM:SS
            throttle_index=data[44:46]
            throttle_len=data[46:48]
            throttle_data=data[48:212]
            pas_index=data[212:214]
            pas_len=data[214:216]
            pas_data=data[216:298]
            stop=data[298:300]
    
    elif header=="2a2a":
        packet_length=data[4:6]
        reserve=data[6:10]
        imei=data[10:26]
        print("IMEI :",imei)
        reserve_2=data[26:30]
        proto_num=data[30:32]
        print("Protocol Number :",proto_num)
        date=data[32:38] #date in hex
        print("Date :", int(date[4:6],16),"/",int(date[2:4],16),"/",int(date[0:2],16)) # date DD/MM/YY
        time=data[38:44] # time in hex
        print("Time :", int(time[0:2],16),":",int(time[2:4],16),":",int(time[4:6],16)) # time HH:MM:SS
        lat=data[44:52]
        lat=int(lat,16)/1800000
        print("Latitude :",lat)
        long=data[52:60]
        long=int(long,16)/1800000
        print("Longitude :",long)
        flag=data[60:62]
        print("Flag",flag)
        dm_event=data[62:64]
        print("DM Event :",dm_event)
        cmd_src_index=data[64:66]
        dm_src_len=data[66:68]
        src_len=int(dm_src_len,16)
        x=68+(src_len*2)
        dm_src=data[68:x] #source data - mobile number/ip address
        byt_array=bytearray.fromhex(dm_src)
        dm_src=byt_array.decode("ASCII")
        print("DM Source :",dm_src)
        cmd_data_index=data[x:x+2]
        dm_data_len=data[x+2:x+4]
        data_len=int(dm_data_len,16)
        y=x+4+(data_len*2)
        dm_data=data[x+4:y] # command data - TBD
        byte_array=bytearray.fromhex(dm_data)
        dm_data=byte_array.decode("ASCII")
        print("DM data :",dm_data)
        cmd_serial=data[y:y+4]
        print("Command Serial Number :",cmd_serial)
        stop=data[y:y+4]
        print("Stop byte:",stop)
    
    elif header=="1a1a":
        byte_array=bytearray.fromhex(data)
        text_data=byte_array.decode("ASCII")
        print(text_data)
        imei=text_data[3:19] # imei number
        print("IMEI :",imei)
        vlt_msg_ver=text_data[19:22]
        print("vlt_msg_ver :",vlt_msg_ver)
        bot=text_data[22:26]
        print("Boot message :",bot)
        firm_version=text_data[26:33]
        print("Firm Version :",firm_version)
        ccid=text_data[33:54]
        print("CCID :",ccid)
        lock_status=text_data[54:56] 
        print("Lock Status :",lock_status)
        main_volt=text_data[56:61]
        print("Main Voltage :",main_volt)
        msg=text_data[61:len(data)-5]
        print("Message :",msg)
        passkey=text_data[len(text_data)-7:len(text_data)-1] #passkey (considering last character is ";")
        print("Passkey :",passkey)
        
        
    
    print("Press any key to exit and 'enter' to restart") #looping to re-enter a new packet
    k=input()