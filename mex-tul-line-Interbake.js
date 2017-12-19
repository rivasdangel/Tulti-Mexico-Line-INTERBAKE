var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
  var secPubNub=0;
  var Frezzerct = null,
      Frezzerresults = null,
      CntInFrezzer = null,
      CntOutFrezzer = null,
      Frezzeractual = 0,
      Frezzertime = 0,
      Frezzersec = 0,
      FrezzerflagStopped = false,
      Frezzerstate = 0,
      Frezzerspeed = 0,
      FrezzerspeedTemp = 0,
      FrezzerflagPrint = 0,
      FrezzersecStop = 0,
      FrezzerONS = false,
      FrezzertimeStop = 60, //NOTE: Timestop en segundos
      FrezzerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      FrezzerflagRunning = false,
      CntInFrezzer1 = null;
  var Filler1ct = null,
      Filler1results = null,
      CntInFiller1 = null,
      CntOutFiller1 = null,
      Filler1actual = 0,
      Filler1time = 0,
      Filler1sec = 0,
      Filler1flagStopped = false,
      Filler1state = 0,
      Filler1speed = 0,
      Filler1speedTemp = 0,
      Filler1flagPrint = 0,
      Filler1secStop = 0,
      Filler1ONS = false,
      Filler1timeStop = 60, //NOTE: Timestop en segundos
      Filler1Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      Filler1flagRunning = false;
  var Filler2ct = null,
      Filler2results = null,
      CntInFiller2 = null,
      CntOutFiller2 = null,
      Filler2actual = 0,
      Filler2time = 0,
      Filler2sec = 0,
      Filler2flagStopped = false,
      Filler2state = 0,
      Filler2speed = 0,
      Filler2speedTemp = 0,
      Filler2flagPrint = 0,
      Filler2secStop = 0,
      Filler2ONS = false,
      Filler2timeStop = 60, //NOTE: Timestop en segundos
      Filler2Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      Filler2flagRunning = false;
  var Xray1ct = null,
      Xray1results = null,
      CntInXray1 = null,
      CntOutXray1 = null,
      Xray1actual = 0,
      Xray1time = 0,
      Xray1sec = 0,
      Xray1flagStopped = false,
      Xray1state = 0,
      Xray1speed = 0,
      Xray1speedTemp = 0,
      Xray1flagPrint = 0,
      Xray1secStop = 0,
      Xray1ONS = false,
      Xray1timeStop = 60, //NOTE: Timestop en segundos
      Xray1Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      Xray1flagRunning = false;
      var Xray2ct = null,
          Xray2results = null,
          CntInXray2 = null,
          CntOutXray2 = null,
          Xray2actual = 0,
          Xray2time = 0,
          Xray2sec = 0,
          Xray2flagStopped = false,
          Xray2state = 0,
          Xray2speed = 0,
          Xray2speedTemp = 0,
          Xray2flagPrint = 0,
          Xray2secStop = 0,
          Xray2ONS = false,
          Xray2timeStop = 60, //NOTE: Timestop en segundos
          Xray2Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
          Xray2flagRunning = false;
  var CntOutEOL=null,
      secEOL=0;
  var publishConfig;
      var intId1,intId2,intId3,intId4;
      var files = fs.readdirSync("C:/PULSE/INTERBAKE_LOGS/"); //Leer documentos
      var actualdate = Date.now(); //Fecha actual
      var text2send=[];//Vector a enviar
      var flagInfo2Send=0;
      var i=0;
      var pubnub = new PubNub({
        publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
      subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
        uuid: "MEX_TUL_INTERBAKE"
      });


      var senderData = function (){
        pubnub.publish(publishConfig, function(status, response) {
      });};

      var client1 = modbus.client.tcp.complete({
        'host': "192.168.10.90",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client2 = modbus.client.tcp.complete({
        'host': "192.168.10.91",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client3 = modbus.client.tcp.complete({
        'host': "192.168.10.92",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client4 = modbus.client.tcp.complete({
        'host': "192.168.10.93",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
}catch(err){
    fs.appendFileSync("error_declarations.log",err + '\n');
}
try{
  client1.connect();
  client2.connect();
  client3.connect();
  client4.connect();
}catch(err){
  fs.appendFileSync("error_connection.log",err + '\n');
}
try{
  /*----------------------------------------------------------------------------------function-------------------------------------------------------------------------------------------*/
  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
        if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/INTERBAKE_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (3*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          secPubNub=0;
          publishConfig = {
            channel : "MEX_TUL_Monitor",
            message : {
                  line: "1",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
//PubNub --------------------------------------------------------------------------------------------------------------------
client1.on('connect', function(err) {
  intId1 =
    setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntInFrezzer1 =  joinWord(resp.register[0], resp.register[1]);
          CntOutFiller1 = joinWord(resp.register[2], resp.register[3]);
          //------------------------------------------Filler1----------------------------------------------
                Filler1ct = CntOutFiller1 // NOTE: igualar al contador de salida
                if (!Filler1ONS && Filler1ct) {
                  Filler1speedTemp = Filler1ct
                  Filler1sec = Date.now()
                  Filler1ONS = true
                  Filler1time = Date.now()
                }
                if(Filler1ct > Filler1actual){
                  if(Filler1flagStopped){
                    Filler1speed = Filler1ct - Filler1speedTemp
                    Filler1speedTemp = Filler1ct
                    Filler1sec = Date.now()
                    Filler1time = Date.now()
                  }
                  Filler1secStop = 0
                  Filler1state = 1
                  Filler1flagStopped = false
                  Filler1flagRunning = true
                } else if( Filler1ct == Filler1actual ){
                  if(Filler1secStop == 0){
                    Filler1time = Date.now()
                    Filler1secStop = Date.now()
                  }
                  if( ( Date.now() - ( Filler1timeStop * 1000 ) ) >= Filler1secStop ){
                    Filler1speed = 0
                    Filler1state = 2
                    Filler1speedTemp = Filler1ct
                    Filler1flagStopped = true
                    Filler1flagRunning = false
                    Filler1flagPrint = 1
                  }
                }
                Filler1actual = Filler1ct
                if(Date.now() - 60000 * Filler1Worktime >= Filler1sec && Filler1secStop == 0){
                  if(Filler1flagRunning && Filler1ct){
                    Filler1flagPrint = 1
                    Filler1secStop = 0
                    Filler1speed = Filler1ct - Filler1speedTemp
                    Filler1speedTemp = Filler1ct
                    Filler1sec = Date.now()
                  }
                }
                Filler1results = {
                  ST: Filler1state,
                  CPQI: CntInFiller1,
                  CPQO: CntOutFiller1,
                  SP: Filler1speed
                }
                if (Filler1flagPrint == 1) {
                  for (var key in Filler1results) {
                    if( Filler1results[key] != null && ! isNaN(Filler1results[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Filler1_INTERBAKE.log', 'tt=' + Filler1time + ',var=' + key + ',val=' + Filler1results[key] + '\n')
                  }
                  Filler1flagPrint = 0
                  Filler1secStop = 0
                  Filler1time = Date.now()
                }
          //------------------------------------------Filler1----------------------------------------------
        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {
    clearInterval(intId1);
  });
  client2.on('connect', function(err) {
    intId2 =
      setInterval(function(){
          client2.readHoldingRegisters(0, 16).then(function(resp) {
            CntInFrezzer =  joinWord(resp.register[0], resp.register[1])+CntInFrezzer1;
            CntOutFiller2 = joinWord(resp.register[2], resp.register[3]);
            //------------------------------------------Frezzer----------------------------------------------
                  Frezzerct = CntOutFrezzer // NOTE: igualar al contador de salida
                  if (!FrezzerONS && Frezzerct) {
                    FrezzerspeedTemp = Frezzerct
                    Frezzersec = Date.now()
                    FrezzerONS = true
                    Frezzertime = Date.now()
                  }
                  if(Frezzerct > Frezzeractual){
                    if(FrezzerflagStopped){
                      Frezzerspeed = Frezzerct - FrezzerspeedTemp
                      FrezzerspeedTemp = Frezzerct
                      Frezzersec = Date.now()
                      Frezzertime = Date.now()
                    }
                    FrezzersecStop = 0
                    Frezzerstate = 1
                    FrezzerflagStopped = false
                    FrezzerflagRunning = true
                  } else if( Frezzerct == Frezzeractual ){
                    if(FrezzersecStop == 0){
                      Frezzertime = Date.now()
                      FrezzersecStop = Date.now()
                    }
                    if( ( Date.now() - ( FrezzertimeStop * 1000 ) ) >= FrezzersecStop ){
                      Frezzerspeed = 0
                      Frezzerstate = 2
                      FrezzerspeedTemp = Frezzerct
                      FrezzerflagStopped = true
                      FrezzerflagRunning = false
                      FrezzerflagPrint = 1
                    }
                  }
                  Frezzeractual = Frezzerct
                  if(Date.now() - 60000 * FrezzerWorktime >= Frezzersec && FrezzersecStop == 0){
                    if(FrezzerflagRunning && Frezzerct){
                      FrezzerflagPrint = 1
                      FrezzersecStop = 0
                      Frezzerspeed = Frezzerct - FrezzerspeedTemp
                      FrezzerspeedTemp = Frezzerct
                      Frezzersec = Date.now()
                    }
                  }
                  Frezzerresults = {
                    ST: Frezzerstate,
                    CPQI: CntInFrezzer,
                    CPQO: CntOutFrezzer,
                    SP: Frezzerspeed
                  }
                  if (FrezzerflagPrint == 1) {
                    for (var key in Frezzerresults) {
                      if( Frezzerresults[key] != null && ! isNaN(Frezzerresults[key]) )
                      //NOTE: Cambiar path
                      fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Frezzer_INTERBAKE.log', 'tt=' + Frezzertime + ',var=' + key + ',val=' + Frezzerresults[key] + '\n')
                    }
                    FrezzerflagPrint = 0
                    FrezzersecStop = 0
                    Frezzertime = Date.now()
                  }
            //------------------------------------------Frezzer----------------------------------------------
            //------------------------------------------Filler2----------------------------------------------
                  Filler2ct = CntOutFiller2 // NOTE: igualar al contador de salida
                  if (!Filler2ONS && Filler2ct) {
                    Filler2speedTemp = Filler2ct
                    Filler2sec = Date.now()
                    Filler2ONS = true
                    Filler2time = Date.now()
                  }
                  if(Filler2ct > Filler2actual){
                    if(Filler2flagStopped){
                      Filler2speed = Filler2ct - Filler2speedTemp
                      Filler2speedTemp = Filler2ct
                      Filler2sec = Date.now()
                      Filler2time = Date.now()
                    }
                    Filler2secStop = 0
                    Filler2state = 1
                    Filler2flagStopped = false
                    Filler2flagRunning = true
                  } else if( Filler2ct == Filler2actual ){
                    if(Filler2secStop == 0){
                      Filler2time = Date.now()
                      Filler2secStop = Date.now()
                    }
                    if( ( Date.now() - ( Filler2timeStop * 1000 ) ) >= Filler2secStop ){
                      Filler2speed = 0
                      Filler2state = 2
                      Filler2speedTemp = Filler2ct
                      Filler2flagStopped = true
                      Filler2flagRunning = false
                      Filler2flagPrint = 1
                    }
                  }
                  Filler2actual = Filler2ct
                  if(Date.now() - 60000 * Filler2Worktime >= Filler2sec && Filler2secStop == 0){
                    if(Filler2flagRunning && Filler2ct){
                      Filler2flagPrint = 1
                      Filler2secStop = 0
                      Filler2speed = Filler2ct - Filler2speedTemp
                      Filler2speedTemp = Filler2ct
                      Filler2sec = Date.now()
                    }
                  }
                  Filler2results = {
                    ST: Filler2state,
                    CPQI: CntInFiller2,
                    CPQO: CntOutFiller2,
                    SP: Filler2speed
                  }
                  if (Filler2flagPrint == 1) {
                    for (var key in Filler2results) {
                      if( Filler2results[key] != null && ! isNaN(Filler2results[key]) )
                      //NOTE: Cambiar path
                      fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Filler2_INTERBAKE.log', 'tt=' + Filler2time + ',var=' + key + ',val=' + Filler2results[key] + '\n')
                    }
                    Filler2flagPrint = 0
                    Filler2secStop = 0
                    Filler2time = Date.now()
                  }
            //------------------------------------------Filler2----------------------------------------------
          });//Cierre de lectura
        },1000);
    });//Cierre de cliente

    client2.on('error', function(err){
      clearInterval(intId2);
    });
    client2.on('close', function() {
      clearInterval(intId2);
    });
    client3.on('connect', function(err) {
      intId3 =
        setInterval(function(){
            client3.readHoldingRegisters(0, 16).then(function(resp) {
              CntOutEOL =  joinWord(resp.register[0], resp.register[1]);
              CntOutXray1 =  joinWord(resp.register[2], resp.register[3]);
              CntInXray1 =  joinWord(resp.register[4], resp.register[5]);
              //------------------------------------------Xray1----------------------------------------------
                    Xray1ct = CntOutXray1 // NOTE: igualar al contador de salida
                    if (!Xray1ONS && Xray1ct) {
                      Xray1speedTemp = Xray1ct
                      Xray1sec = Date.now()
                      Xray1ONS = true
                      Xray1time = Date.now()
                    }
                    if(Xray1ct > Xray1actual){
                      if(Xray1flagStopped){
                        Xray1speed = Xray1ct - Xray1speedTemp
                        Xray1speedTemp = Xray1ct
                        Xray1sec = Date.now()
                        Xray1time = Date.now()
                      }
                      Xray1secStop = 0
                      Xray1state = 1
                      Xray1flagStopped = false
                      Xray1flagRunning = true
                    } else if( Xray1ct == Xray1actual ){
                      if(Xray1secStop == 0){
                        Xray1time = Date.now()
                        Xray1secStop = Date.now()
                      }
                      if( ( Date.now() - ( Xray1timeStop * 1000 ) ) >= Xray1secStop ){
                        Xray1speed = 0
                        Xray1state = 2
                        Xray1speedTemp = Xray1ct
                        Xray1flagStopped = true
                        Xray1flagRunning = false
                        Xray1flagPrint = 1
                      }
                    }
                    Xray1actual = Xray1ct
                    if(Date.now() - 60000 * Xray1Worktime >= Xray1sec && Xray1secStop == 0){
                      if(Xray1flagRunning && Xray1ct){
                        Xray1flagPrint = 1
                        Xray1secStop = 0
                        Xray1speed = Xray1ct - Xray1speedTemp
                        Xray1speedTemp = Xray1ct
                        Xray1sec = Date.now()
                      }
                    }
                    Xray1results = {
                      ST: Xray1state,
                      CPQI: CntInXray1,
                      CPQO: CntOutXray1,
                      SP: Xray1speed
                    }
                    if (Xray1flagPrint == 1) {
                      for (var key in Xray1results) {
                        if( Xray1results[key] != null && ! isNaN(Xray1results[key]) )
                        //NOTE: Cambiar path
                        fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Xray1_INTERBAKE.log', 'tt=' + Xray1time + ',var=' + key + ',val=' + Xray1results[key] + '\n')
                      }
                      Xray1flagPrint = 0
                      Xray1secStop = 0
                      Xray1time = Date.now()
                    }
              //------------------------------------------Xray1----------------------------------------------
              /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                   if(secEOL>=60 && CntOutEOL){
                      fs.appendFileSync("C:/PULSE/INTERBAKE_LOGS/mex_tul_eol_interbake.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                      secEOL=0;
                    }else{
                      secEOL++;
                    }
              /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/

            });//Cierre de lectura
          },1000);
      });//Cierre de cliente

      client3.on('error', function(err){
        clearInterval(intId3);
      });
      client3.on('close', function() {
        clearInterval(intId3);
      });
      client4.on('connect', function(err) {
        intId4 =
          setInterval(function(){
              client4.readHoldingRegisters(0, 16).then(function(resp) {
                CntInXray2 =  joinWord(resp.register[0], resp.register[1]);
                CntOutXray2 =  joinWord(resp.register[2], resp.register[3]);
                //------------------------------------------Xray2----------------------------------------------
                      Xray2ct = CntOutXray2 // NOTE: igualar al contador de salida
                      if (!Xray2ONS && Xray2ct) {
                        Xray2speedTemp = Xray2ct
                        Xray2sec = Date.now()
                        Xray2ONS = true
                        Xray2time = Date.now()
                      }
                      if(Xray2ct > Xray2actual){
                        if(Xray2flagStopped){
                          Xray2speed = Xray2ct - Xray2speedTemp
                          Xray2speedTemp = Xray2ct
                          Xray2sec = Date.now()
                          Xray2time = Date.now()
                        }
                        Xray2secStop = 0
                        Xray2state = 1
                        Xray2flagStopped = false
                        Xray2flagRunning = true
                      } else if( Xray2ct == Xray2actual ){
                        if(Xray2secStop == 0){
                          Xray2time = Date.now()
                          Xray2secStop = Date.now()
                        }
                        if( ( Date.now() - ( Xray2timeStop * 1000 ) ) >= Xray2secStop ){
                          Xray2speed = 0
                          Xray2state = 2
                          Xray2speedTemp = Xray2ct
                          Xray2flagStopped = true
                          Xray2flagRunning = false
                          Xray2flagPrint = 1
                        }
                      }
                      Xray2actual = Xray2ct
                      if(Date.now() - 60000 * Xray2Worktime >= Xray2sec && Xray2secStop == 0){
                        if(Xray2flagRunning && Xray2ct){
                          Xray2flagPrint = 1
                          Xray2secStop = 0
                          Xray2speed = Xray2ct - Xray2speedTemp
                          Xray2speedTemp = Xray2ct
                          Xray2sec = Date.now()
                        }
                      }
                      Xray2results = {
                        ST: Xray2state,
                        CPQI: CntInXray2,
                        CPQO: CntOutXray2,
                        SP: Xray2speed
                      }
                      if (Xray2flagPrint == 1) {
                        for (var key in Xray2results) {
                          if( Xray2results[key] != null && ! isNaN(Xray2results[key]) )
                          //NOTE: Cambiar path
                          fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Xray2_INTERBAKE.log', 'tt=' + Xray2time + ',var=' + key + ',val=' + Xray2results[key] + '\n')
                        }
                        Xray2flagPrint = 0
                        Xray2secStop = 0
                        Xray2time = Date.now()
                      }
                //------------------------------------------Xray2----------------------------------------------
              });//Cierre de lectura
            },1000);
        });//Cierre de cliente

        client4.on('error', function(err){
          clearInterval(intId4);
        });
        client4.on('close', function() {
            clearInterval(intId4);
        });
}catch(err){
    fs.appendFileSync("error_interbake.log",err + '\n');
}
