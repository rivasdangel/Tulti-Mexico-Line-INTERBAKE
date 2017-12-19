var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE INTERBAKE SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\mex-tul-line-Interbake.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})


svc.on('install',function(){
  svc.start()
})

svc.install()
