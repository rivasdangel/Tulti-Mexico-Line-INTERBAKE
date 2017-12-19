var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
  var secPubNub=0;
  var Frezzerct = null,
      Frezzerresults = null,
      Frezzeractual = 0,
      Frezzertime = 0,
      Frezzersec = 0,
      FrezzerflagStopped = false,
      Frezzerstate = 0,
      Frezzerspeed = 0,
      FrezzerspeedTemp = 0,
      FrezzerflagPrint = 0,
      FrezzersecStop = 0,
      FrezzerONS = 0,
      FrezzertimeStop = 50, //NOTE: Timestop
      FrezzerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
      FrezzerflagRunning = false,
      CntInFrezzer=null,
      CntInFrezzer1=null;
  var Filler1ct = null,
      Filler1results = null,
      Filler1actual = 0,
      Filler1time = 0,
      Filler1sec = 0,
      Filler1flagStopped = false,
      Filler1state = 0,
      Filler1speed = 0,
      Filler1speedTemp = 0,
      Filler1flagPrint = 0,
      Filler1secStop = 0,
      Filler1ONS = 0,
      Filler1timeStop = 50, //NOTE: Timestop
      Filler1Worktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
      Filler1flagRunning = false,
      CntOutFiller1=null;
  var Filler2ct = null,
      Filler2results = null,
      Filler2actual = 0,
      Filler2time = 0,
      Filler2sec = 0,
      Filler2flagStopped = false,
      Filler2state = 0,
      Filler2speed = 0,
      Filler2speedTemp = 0,
      Filler2flagPrint = 0,
      Filler2secStop = 0,
      Filler2ONS = 0,
      Filler2timeStop = 50, //NOTE: Timestop
      Filler2Worktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
      Filler2flagRunning = false,
      CntOutFiller2=null;
      var Xray1ct = null,
          Xray1results = null,
          Xray1actual = 0,
          Xray1time = 0,
          Xray1sec = 0,
          Xray1flagStopped = false,
          Xray1state = 0,
          Xray1speed = 0,
          Xray1speedTemp = 0,
          Xray1flagPrint = 0,
          Xray1secStop = 0,
          Xray1ONS = 0,
          Xray1timeStop = 50, //NOTE: Timestop
          Xray1Worktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
          Xray1flagRunning = false,
          CntOutXray1=null,
          CntInXray1=null;
          var Xray2ct = null,
              Xray2results = null,
              Xray2actual = 0,
              Xray2time = 0,
              Xray2sec = 0,
              Xray2flagStopped = false,
              Xray2state = 0,
              Xray2speed = 0,
              Xray2speedTemp = 0,
              Xray2flagPrint = 0,
              Xray2secStop = 0,
              Xray2ONS = 0,
              Xray2timeStop = 50, //NOTE: Timestop
              Xray2Worktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
              Xray2flagRunning = false,
              CntOutXray2=null,
              CntInXray2=null;
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
                Filler1ct = CntOutFiller1; // NOTE: igualar al contador de salida
                if (Filler1ONS == 0 && Filler1ct) {
                  Filler1speedTemp = Filler1ct;
                  Filler1ONS = 1;
                }
                if(Filler1ct > Filler1actual){
                  if(Filler1flagStopped){
                    Filler1speed = Filler1ct -Filler1speedTemp;
                    Filler1speedTemp = Filler1ct;
                    Filler1sec = 0;
                  }
                  Filler1secStop = 0;
                  Filler1sec++;
                  Filler1time = Date.now();
                  Filler1state = 1;
                  Filler1flagStopped = false;
                  Filler1flagRunning = true;
                } else if( Filler1ct == Filler1actual ){
                  if(Filler1secStop == 0){
                    Filler1time = Date.now();
                  }
                  Filler1secStop++;
                  if(Filler1secStop >= Filler1timeStop){
                    Filler1speed = 0;
                    Filler1state = 2;
                    Filler1speedTemp = Filler1ct;
                    Filler1flagStopped = true;
                    Filler1flagRunning = false;
                    //NOTE: Esperar indicaciones
                    //if(!CntOutCasePacker0)
                      //Filler1state = 3;
                  }
                  if(Filler1secStop % (Filler1timeStop*3) == 0 ||Filler1secStop == Filler1timeStop ){
                    Filler1flagPrint=1;

                    if(Filler1secStop % (Filler1timeStop*3) == 0){
                      Filler1time = Date.now();
                    }
                  }
                }
                Filler1actual = Filler1ct;
                if(Filler1sec == Filler1Worktime){
                  Filler1sec = 0;
                  if(Filler1flagRunning && Filler1ct){
                    Filler1flagPrint = 1;
                    Filler1secStop = 0;
                    Filler1speed = Filler1ct - Filler1speedTemp;
                    Filler1speedTemp = Filler1ct;
                  }
                }

                Filler1results = {
                  ST: Filler1state,
                  CPQO : CntOutFiller1,
                  SP: Filler1speed
                };
                if (Filler1flagPrint == 1 && Filler1ct) {
                  for (var key in Filler1results) {
                    if(Filler1results[key] != null && ! isNaN(Filler1results[key]))
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/INTERBAKE_LOGS/mex_tul_filler1_interbake.log', 'tt=' + Frezzertime + ',var=' + key + ',val=' + Frezzerresults[key] + '\n');
                  }
                  Filler1flagPrint = 0;
                }
          //------------------------------------------Filler1----------------------------------------------
        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {

  });
  client2.on('connect', function(err) {
    intId2 =
      setInterval(function(){
          client2.readHoldingRegisters(0, 16).then(function(resp) {
            CntInFrezzer =  joinWord(resp.register[0], resp.register[1])+CntInFrezzer1;
            CntOutFiller2 = joinWord(resp.register[2], resp.register[3]);
            //------------------------------------------Frezzer----------------------------------------------
                  Frezzerct = CntInFrezzer; // NOTE: igualar al contador de salida
                  if (FrezzerONS == 0 && Frezzerct) {
                    FrezzerspeedTemp = Frezzerct;
                    FrezzerONS = 1;
                  }
                  if(Frezzerct > Frezzeractual){
                    if(FrezzerflagStopped){
                      Frezzerspeed = Frezzerct -FrezzerspeedTemp;
                      FrezzerspeedTemp = Frezzerct;
                      Frezzersec = 0;
                    }
                    FrezzersecStop = 0;
                    Frezzersec++;
                    Frezzertime = Date.now();
                    Frezzerstate = 1;
                    FrezzerflagStopped = false;
                    FrezzerflagRunning = true;
                  } else if( Frezzerct == Frezzeractual ){
                    if(FrezzersecStop == 0){
                      Frezzertime = Date.now();
                    }
                    FrezzersecStop++;
                    if(FrezzersecStop >= FrezzertimeStop){
                      Frezzerspeed = 0;
                      Frezzerstate = 2;
                      FrezzerspeedTemp = Frezzerct;
                      FrezzerflagStopped = true;
                      FrezzerflagRunning = false;
                      //NOTE: Esperar indicaciones
                      //if(!CntOutCasePacker0)
                        //Frezzerstate = 3;
                    }
                    if(FrezzersecStop % (FrezzertimeStop*3) == 0 ||FrezzersecStop == FrezzertimeStop ){
                      FrezzerflagPrint=1;

                      if(FrezzersecStop % (FrezzertimeStop*3) == 0){
                        Frezzertime = Date.now();
                      }
                    }
                  }
                  Frezzeractual = Frezzerct;
                  if(Frezzersec == FrezzerWorktime){
                    Frezzersec = 0;
                    if(FrezzerflagRunning && Frezzerct){
                      FrezzerflagPrint = 1;
                      FrezzersecStop = 0;
                      Frezzerspeed = Frezzerct - FrezzerspeedTemp;
                      FrezzerspeedTemp = Frezzerct;
                    }
                  }

                  Frezzerresults = {
                    ST: Frezzerstate,
                    CPQO : CntOutFrezzer,
                    SP: Frezzerspeed
                  };
                  if (FrezzerflagPrint == 1 && Frezzerct) {
                    for (var key in Frezzerresults) {
                      if(Frezzerresults[key] != null && ! isNaN(Frezzerresults[key]))
                      //NOTE: Cambiar path
                      fs.appendFileSync('C:/PULSE/INTERBAKE_LOGS/mex_tul_Frezzer_interbake.log', 'tt=' + Frezzertime + ',var=' + key + ',val=' + Frezzerresults[key] + '\n');
                    }
                    FrezzerflagPrint = 0;
                  }
            //------------------------------------------Frezzer----------------------------------------------
            //------------------------------------------Filler2----------------------------------------------
                  Filler2ct = CntOutFiller2; // NOTE: igualar al contador de salida
                  if (Filler2ONS == 0 && Filler2ct) {
                    Filler2speedTemp = Filler2ct;
                    Filler2ONS = 1;
                  }
                  if(Filler2ct > Filler2actual){
                    if(Filler2flagStopped){
                      Filler2speed = Filler2ct -Filler2speedTemp;
                      Filler2speedTemp = Filler2ct;
                      Filler2sec = 0;
                    }
                    Filler2secStop = 0;
                    Filler2sec++;
                    Filler2time = Date.now();
                    Filler2state = 1;
                    Filler2flagStopped = false;
                    Filler2flagRunning = true;
                  } else if( Filler2ct == Filler2actual ){
                    if(Filler2secStop == 0){
                      Filler2time = Date.now();
                    }
                    Filler2secStop++;
                    if(Filler2secStop >= Filler2timeStop){
                      Filler2speed = 0;
                      Filler2state = 2;
                      Filler2speedTemp = Filler2ct;
                      Filler2flagStopped = true;
                      Filler2flagRunning = false;
                      //NOTE: Esperar indicaciones
                      //if(!CntOutCasePacker0)
                        //Filler2state = 3;
                    }
                    if(Filler2secStop % (Filler2timeStop*3) == 0 ||Filler2secStop == Filler2timeStop ){
                      Filler2flagPrint=1;

                      if(Filler2secStop % (Filler2timeStop*3) == 0){
                        Filler2time = Date.now();
                      }
                    }
                  }
                  Filler2actual = Filler2ct;
                  if(Filler2sec == Filler2Worktime){
                    Filler2sec = 0;
                    if(Filler2flagRunning && Filler2ct){
                      Filler2flagPrint = 1;
                      Filler2secStop = 0;
                      Filler2speed = Filler2ct - Filler2speedTemp;
                      Filler2speedTemp = Filler2ct;
                    }
                  }

                  Filler2results = {
                    ST: Filler2state,
                    CPQO : CntOutFiller2,
                    SP: Filler2speed
                  };
                  if (Filler2flagPrint == 1 && Filler2ct) {
                    for (var key in Filler2results) {
                      if(Filler2results[key] != null && ! isNaN(Filler2results[key]))
                      //NOTE: Cambiar path
                      fs.appendFileSync('C:/PULSE/INTERBAKE_LOGS/mex_tul_Filler2_interbake.log', 'tt=' + Filler2time + ',var=' + key + ',val=' + Filler2results[key] + '\n');
                    }
                    Filler2flagPrint = 0;
                  }
            //------------------------------------------Filler2----------------------------------------------
          });//Cierre de lectura
        },1000);
    });//Cierre de cliente

    client2.on('error', function(err){
      clearInterval(intId1);
    });
    client2.on('close', function() {

    });
    client3.on('connect', function(err) {
      intId3 =
        setInterval(function(){
            client3.readHoldingRegisters(0, 16).then(function(resp) {
              CntOutEOL =  joinWord(resp.register[0], resp.register[1]);
              CntOutXray1 =  joinWord(resp.register[2], resp.register[3]);
              CntInXray1 =  joinWord(resp.register[4], resp.register[5]);
              //------------------------------------------Xray1----------------------------------------------
                    Xray1ct = CntOutXray1; // NOTE: igualar al contador de salida
                    if (Xray1ONS == 0 && Xray1ct) {
                      Xray1speedTemp = Xray1ct;
                      Xray1ONS = 1;
                    }
                    if(Xray1ct > Xray1actual){
                      if(Xray1flagStopped){
                        Xray1speed = Xray1ct -Xray1speedTemp;
                        Xray1speedTemp = Xray1ct;
                        Xray1sec = 0;
                      }
                      Xray1secStop = 0;
                      Xray1sec++;
                      Xray1time = Date.now();
                      Xray1state = 1;
                      Xray1flagStopped = false;
                      Xray1flagRunning = true;
                    } else if( Xray1ct == Xray1actual ){
                      if(Xray1secStop == 0){
                        Xray1time = Date.now();
                      }
                      Xray1secStop++;
                      if(Xray1secStop >= Xray1timeStop){
                        Xray1speed = 0;
                        Xray1state = 2;
                        Xray1speedTemp = Xray1ct;
                        Xray1flagStopped = true;
                        Xray1flagRunning = false;
                        //NOTE: Esperar indicaciones
                        //if(!CntOutCasePacker0)
                          //Xray1state = 3;
                      }
                      if(Xray1secStop % (Xray1timeStop*3) == 0 ||Xray1secStop == Xray1timeStop ){
                        Xray1flagPrint=1;

                        if(Xray1secStop % (Xray1timeStop*3) == 0){
                          Xray1time = Date.now();
                        }
                      }
                    }
                    Xray1actual = Xray1ct;
                    if(Xray1sec == Xray1Worktime){
                      Xray1sec = 0;
                      if(Xray1flagRunning && Xray1ct){
                        Xray1flagPrint = 1;
                        Xray1secStop = 0;
                        Xray1speed = Xray1ct - Xray1speedTemp;
                        Xray1speedTemp = Xray1ct;
                      }
                    }

                    Xray1results = {
                      ST: Xray1state,
                      CPQI: CntInXray1,
                      CPQO: CntOutXray1,
                      SP: Xray1speed
                    };
                    if (Xray1flagPrint == 1 && Xray1ct) {
                      for (var key in Xray1results) {
                        if(Xray1results[key] != null && ! isNaN(Xray1results[key]))
                        //NOTE: Cambiar path
                        fs.appendFileSync('C:/PULSE/INTERBAKE_LOGS/mex_tul_Xray1_interbake.log', 'tt=' + Xray1time + ',var=' + key + ',val=' + Xray1results[key] + '\n');
                      }
                      Xray1flagPrint = 0;
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
        clearInterval(intId1);
      });
      client3.on('close', function() {

      });
      client4.on('connect', function(err) {
        intId4 =
          setInterval(function(){
              client4.readHoldingRegisters(0, 16).then(function(resp) {
                CntInXray2 =  joinWord(resp.register[0], resp.register[1]);
                CntOutXray2 =  joinWord(resp.register[2], resp.register[3]);
                //------------------------------------------Xray2----------------------------------------------
                      Xray2ct = CntOutXray2; // NOTE: igualar al contador de salida
                      if (Xray2ONS == 0 && Xray2ct) {
                        Xray2speedTemp = Xray2ct;
                        Xray2ONS = 1;
                      }
                      if(Xray2ct > Xray2actual){
                        if(Xray2flagStopped){
                          Xray2speed = Xray2ct -Xray2speedTemp;
                          Xray2speedTemp = Xray2ct;
                          Xray2sec = 0;
                        }
                        Xray2secStop = 0;
                        Xray2sec++;
                        Xray2time = Date.now();
                        Xray2state = 1;
                        Xray2flagStopped = false;
                        Xray2flagRunning = true;
                      } else if( Xray2ct == Xray2actual ){
                        if(Xray2secStop == 0){
                          Xray2time = Date.now();
                        }
                        Xray2secStop++;
                        if(Xray2secStop >= Xray2timeStop){
                          Xray2speed = 0;
                          Xray2state = 2;
                          Xray2speedTemp = Xray2ct;
                          Xray2flagStopped = true;
                          Xray2flagRunning = false;
                          //NOTE: Esperar indicaciones
                          //if(!CntOutCasePacker0)
                            //Xray2state = 3;
                        }
                        if(Xray2secStop % (Xray2timeStop*3) == 0 ||Xray2secStop == Xray2timeStop ){
                          Xray2flagPrint=1;

                          if(Xray2secStop % (Xray2timeStop*3) == 0){
                            Xray2time = Date.now();
                          }
                        }
                      }
                      Xray2actual = Xray2ct;
                      if(Xray2sec == Xray2Worktime){
                        Xray2sec = 0;
                        if(Xray2flagRunning && Xray2ct){
                          Xray2flagPrint = 1;
                          Xray2secStop = 0;
                          Xray2speed = Xray2ct - Xray2speedTemp;
                          Xray2speedTemp = Xray2ct;
                        }
                      }

                      Xray2results = {
                        ST: Xray2state,
                        CPQI: CntInXray2,
                        CPQO: CntOutXray2,
                        SP: Xray2speed
                      };
                      if (Xray2flagPrint == 1 && Xray2ct) {
                        for (var key in Xray2results) {
                          if(Xray2results[key] != null && ! isNaN(Xray2results[key]))
                          //NOTE: Cambiar path
                          fs.appendFileSync('C:/PULSE/INTERBAKE_LOGS/mex_tul_Xray2_interbake.log', 'tt=' + Xray2time + ',var=' + key + ',val=' + Xray2results[key] + '\n');
                        }
                        Xray2flagPrint = 0;
                      }
                //------------------------------------------Xray2----------------------------------------------
              });//Cierre de lectura
            },1000);
        });//Cierre de cliente

        client4.on('error', function(err){
          clearInterval(intId1);
        });
        client4.on('close', function() {

        });
}catch(err){
    fs.appendFileSync("error_interbake.log",err + '\n');
}
