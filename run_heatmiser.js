var heatmiser = require('heatmiser');
var alexa = require('alexa-app');
var heatmiser_functions = require('./heatmiser_functions')

var host = 'localhost';
var pin = 1234;
var command = 'status'
var arg1 = '';
var arg2 = '';
var hm;

function print_help(){
  console.log('Known commands are:\n');
  console.log('\t1. set_away <on/off>\n');
  console.log('\t2. set_keylock <on/off>\n');
  console.log('\t3. set_temperature <temperature>\n');
  console.log('\t4. set_hold <temperature> <hours>\n');
}

function dump_data(data){
  console.log(data);
}

function parse_command()
{
  var dcb = null;
  //Read the command from the commandline
  switch(command){
    case 'set_away':
      on = arg1;
      dcb = heatmiser_functions.set_away(on);
    break;
    case 'set_keylock':
      on = arg1;
      dcb = heatmiser_functions.set_keylock(on);
    break;
    case 'set_temperature':
      temperature = arg1;
      dcb = heatmiser_functions.set_temperature(temperature);
    break;
    case 'set_hold':
      temperature = arg1;
      hours = arg2;
      dcb = heatmiser_functions.set_hold(temperature, hours);
    break;
    case 'set_away':
      on = arg1;
      dcb = heatmiser_functions.set_away(on);
    break;
    case '':
      print_help();
    break;
    default:
      console.log('Unknown command \'' + command + '\'');
      print_help();
    break;
  }

  if(dcb != null){
    hm.write_device(dcb);
  }
}

function initialise_heatmiser(success_callback, error_callback){
  hm = new heatmiser.Wifi(host, pin);

  hm.on('success', success_callback);
  hm.on('error', error_callback);

  hm.read_device(parse_command);
}

function process_cmdline(){
  process.argv.forEach(
    function (val, index, array) {
      switch(index){
        case 2:
          host = val;
        break;
        case 3:
          pin = val;
        break;
        case 4:
          command = val;
        break;
        case 5:
          arg1 = val;
        break;
        case 6:
          arg2 = val;
        break;
      }
    }
  );  
}

function process_ENVS(){
  host = process.env.HOST || host;
  pin = process.env.PIN || pin;
  command = process.env.COMMAND || command;
  arg1 = process.env.ARG1 || arg1;
  arg2 = process.env.ARG2 || arg2;
}

function cmdline(){
  process_cmdline();
  initialise_heatmiser(dump_data, dump_data);
}

//All alexa stuff below

var alexa_app = new alexa.app('heatmiser');

function alexa_connected_to_heatmiser() {
  res.say("Connected to heatmiser");
  res.send();
}
      
function alexa_unable_to_connect_to_heatmiser(){
  res.say("Unable to connect to heatmiser");
  res.send();
}

alexa_app.launch(function (req, res) {
  initialise_heatmiser(alexa_connected_to_heatmiser, alexa_unable_to_connect_to_heatmiser);
  return false;
});

//uncomment below to test locally
//call by running command similar to  node run_heatmiser_command.js <host> <pin> <command> <arg1> <arg2>
//module.exports = {cmdline: cmdline};

//uncomment the below to test in aws lambda
//used to expose the below function to aws lambda
/*exports.heatmiser_lambda = function(event, context, callback) {
  process_ENVS();
  initialise_heatmiser(dump_data, dump_data);
}*/

//uncomment the below to test via alexa
module.exports = alexa_app;
exports.handler = alexa_app.lambda();