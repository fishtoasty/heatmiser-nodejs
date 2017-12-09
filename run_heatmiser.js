var heatmiser = require('heatmiser');
var alexa = require('alexa-app');
var heatmiser_functions = require('./heatmiser_functions')

var host = 'localhost';
var pin = 1234;
var command = 'status'
var arg1 = '';
var arg2 = '';
var hm;

var alexa_app = new alexa.app('heatmiser');


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

function initialise_heatmiser(){
  hm = new heatmiser.Wifi(host, pin);

  hm.on('success', dump_data);
  hm.on('error', dump_data);

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
  initialise_heatmiser();
}

module.exports = {cmdline: cmdline};

exports.heatmiser_lambda = function(event, context, callback) {
  process_ENVS();
  initialise_heatmiser();
}