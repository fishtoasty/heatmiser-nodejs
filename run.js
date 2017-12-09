var heatmiser = require('heatmiser');
var thermostat = require('./thermostat_functions')

var host = 'localhost';
var pin = 1234;
var command = 'status'
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
      on = process.argv[5];
      dcb = thermostat.set_away(on);
    break;
    case 'set_keylock':
      on = process.argv[5];
      dcb = thermostat.set_keylock(on);
    break;
    case 'set_temperature':
      temperature = process.argv[5];
      dcb = thermostat.set_temperature(temperature);
    break;
    case 'set_hold':
      temperature = process.argv[5];
      hours = process.argv[6];
      dcb = thermostat.set_hold(temperature, hours);
    break;
    case 'set_away':
      on = process.argv[5];
      dcb = thermostat.set_away(on);
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

function initialise_thermostat(){
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
      }
    }
  );  
}

function process_ENVS(){
  host = process.env.HOST || host;
  pin = process.env.PIN || pin;
  command = process.env.COMMAND || command;
}

function lambda(){
  process_ENVS();
  initialise_thermostat();
}

function cmdline(){
  process_cmdline();
  initialise_thermostat();
}

module.exports = {lambda: lambda, cmdline: cmdline};