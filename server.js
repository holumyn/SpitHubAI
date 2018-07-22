var express = require('express'),
 app = express(),
  
  port = process.env.PORT || 4000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

  var SerialPort = require('virtual-serialport');
var spy = new SerialPort('/dev/ttyUSB0', { baudrate: 57600 }); // still works if NODE_ENV is set to development!

  var five = require("johnny-five"),
    board = new five.Board({port:spy, timeout: 1e8});



  app.get('/', (req, res) => {
    res.status(200).json({message:'Welcome to SpitHubAI'});
  });

  app.get('/connect_device', (req, res) => {
    
    console.log('Establishing connection!!!!!');
    spy.on("data", function(data) {
        console.log('Sensor connected to USB port successfully!!!!' + data);
    });
     
    spy.writeToComputer("Writing to Computer!!!!!!! I am connecting using false Arduino"); 

    res.status(200).json({
      message: 'Sensor connected to USB port successfully!!!!',
    });

  });

  app.post('/analyzer', (req, res) => {
    
    let sample = req.body.sample;
    let device_id = req.body.device_id;
    
    spy.on("dataToDevice", function (data){
      console.log('Device ready!!!!!!!');
     
      var sensor = new five.Sensor.Digital(2);
      
        sensor.on("change", () => {
          console.log(sensor.value);

          res.status(201).json({
            message: 'Completed successfully',
            value: sensor.value,
          });
        });

        res.status(500).json({
          message: 'Failed',
          value: sensor.value,
        });
      });
  

});

app.listen(port);

console.log('SpitHubAI RESTful API server started on: ' + port);