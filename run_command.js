//INIT START###################################
var heatmiser = require('heatmiser');

var host = 'localhost';
var pin = 1234;
var command = 'status'

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

var hm = new heatmiser.Wifi(host, pin);

hm.on('success', 
  function(data) {
    console.log(data);
  }
);

hm.on('error', 
  function(data) {
    console.log(data);
  }
);

hm.read_device(parse_command);

//INIT END###################################

//Functions Start############################
function set_away(on){
  var mode = on === 'on' ? 'frost' : 'heating';
  var dcb = {
    run_mode: mode 
  };

  hm.write_device(dcb);
}

function set_keylock(on){
    var lock = on === 'on' ? true : false;

    var dcb = {
      keylock: lock
    };

    hm.write_device(dcb);
}

function safeguard_temperature(temperature){
    if (temperature > 35){
        temperature = 35;
    }
    else if (temperature < 5){
        temperature = 5;
    }

    return temperature;
}

function set_temperature(temperature){
    temperature = safeguard_temperature(temperature);

    var dcb = {
      heating: {
        target: parseInt(temperature, 10)
      }
    };

    console.log(dcb);

    hm.write_device(dcb);
}

function safeguard_hours(hours){
    if (hours < 0.5){
        hours = 0.5;
    }
    else if (hours > 24){
        hours = 24;
    }

    return hours;
}


function set_hold(temperature, hours){
    temperature = safeguard_temperature(temperature);
    hours = safeguard_hours(hours);
    var minutes = hours * 60;

    var dcb = {
      heating: {
        target: parseInt(temperature, 10),
        hold: parseInt(minutes, 10)
      }
    };

    hm.write_device(dcb);
}

function print_help(){
  console.log('Known commands are:\n');
  console.log('\t1. set_away <on/off>\n');
  console.log('\t2. set_keylock <on/off>\n');
  console.log('\t3. set_temperature <temperature>\n');
  console.log('\t4. set_hold <temperature> <hours>\n');
}

function parse_command()
{
  //Read the command from the commandline
  switch(command){
    case 'set_away':
      on = process.argv[5];
      set_away(on);
    break;
    case 'set_keylock':
      on = process.argv[5];
      set_keylock(on);
    break;
    case 'set_temperature':
      temperature = process.argv[5];
      set_temperature(temperature);
    break;
    case 'set_hold':
      temperature = process.argv[5];
      hours = process.argv[6];
      set_hold(temperature, hours);
    break;
    case 'set_away':
      on = process.argv[5];
      set_away(on);
    break;
    case '':
      print_help();
    break;
    default:
      console.log('Unknown command \'' + command + '\'');
      print_help();
    break;
  }
}
//Functions End##############################