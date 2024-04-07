
Conversation opened. 1 read message.

Skip to content
Using epickbikes.com Mail with screen readers

4 of 134
Python script for parsing
Inbox

Rajesh D <rajesh@epickbikes.com>
Attachments
22 Mar 2024, 19:10
to me, Aradh


One attachment
  • Scanned by Gmail
"""To parse the recieved server data"""
k=""
while k=="":    
    data=input("Enter data packet : ")
    data=data.replace(" ","")
    data=data.lower()
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
        prot_num=data[30:32] #protocol number
        print("Proto number :", prot_num)
        if prot_num=="10":
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
            gms_signal_strength=int(data[80:82],16)
            voltage=int(data[82:84],16) #internal volatge converted from hex to decimal
            print("Voltage in hex : ", data[82:84])
            print("Voltage of the internal battery :",voltage)
            satelites=int(data[84:86],16)
            print("Number of satellites :",satelites)
            hdop=data[86:88]
            adc=str(int(data[88:92],16)) #external voltage converted from hex to decimal (in millivolts)
            print("ADC value : ",adc)
            odo_index=data[92:94]
            odo_len=data[94:96]
            odo_reading= data[96:106]
            rfid_index=data[106:108]
            rfid_len=data[108:110]
            rfid_tag=data[110:120]
            io_index=data[120:122]
            io_len=data[122:124]
            io_status=data[124:132]
            io_data=bin(int(io_status,16)).zfill(32) #binary data in 32 bits #hex is converted to binary but keeps "b" in the result
            io_data=io_data.replace("b","0") #replaces "b" with "0", if there is "b" in the result
            io_variables=["Trigger Switch","Cam Switch","Extra","PAS","Charger Status","Headlight","Battery Status","Horn","Left Brake","Right Brake","Left Indicator","Right Indicator","Sweat mode","Ignition Sensor","Hall effect power","Extra 2"]
            for i in range(len(io_variables)): #last 16bits are assigned to these parameters from backwards
                print(io_variables[i]," :",end="")
                if io_data[31-i]=="1":
                    print("ON")
                elif io_data[31-i]=="0":
                    print("OFF")
                else:
                    print("Something else: ",io_data[31-i])
            adc_index=data[132:134]
            adc_len=data[134:136]
            adc_data=data[136:148]
            stop=data[148:152]
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
            print("Latitude")
            long=data[52:60]
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
            print(io_data)
            adc_index=data[132:134]
            adc_len=data[134:136]
            adc_data=data[136:148]
            beacon_index=data[148:150]
            beacon_len=data[150:152]
            no_beacon=int(beacon_len,16)/7 #number of beacons, each beacon has 7 bytes
            beacons=[]
            k=152
            for i in range(no_beacon):
                beacons.append(data[k:k+14]) #first byte in every beacon represents signal strength in hex
                k=k+14
            stop=data[k,k+4] #if stop==2323, parsing is accurate
        
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
        reserve_2=data[26:30]
        proto_num=data[30:32]
        date=data[32:38] #date in hex
        print("Date :", int(date[4:6],16),"/",int(date[2:4],16),"/",int(date[0:2],16)) # date DD/MM/YY
        time=data[38:44] # time in hex
        print("Time :", int(time[0:2],16),":",int(time[2:4],16),":",int(time[4:6],16)) # time HH:MM:SS
        lat=data[44:52]
        long=data[52:60]
        flag=data[60:62]
        dm_event=data[62:64]
        cmd_src_index=data[64:66]
        dm_src_len=data[66:68]
        src_len=int(dm_src_len,16)
        x=68+(src_len*2)
        dm_src=data[68:x] #source data - mobile number/ip address
        cmd_data_index=data[x:x+2]
        dm_data_len=data[x+2:x+4]
        data_len=int(dm_data_len,16)
        y=x+4+(data_len*2)
        dm_data=data[x+4:y] # command data - TBD
        stop=data[y:y+4]
    
    elif header=="1a1a":
        imei=data[4:19] # imei number
        vlt_msg_ver=data[19:21]
        bot=data[21:24]
        firm_version=data[24:30]
        ccid=data[30:50]
        ig_status=data[50:51] 
        main_volt=data[51:56]
        msg=data[56:len(data)-5]
        passkey=data[len(data)-7:len(data)-1] #passkey (considering last character is ";")
        
        
    
    print("Press any key to exit and 'enter' to restart") #looping to re-enter a new packet
    k=input()
parse_simple.py
Displaying parse_simple.py.