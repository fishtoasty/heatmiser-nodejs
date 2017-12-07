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
  }

  console.log(dcb);

  hm.write_device(dcb);
}

function parse_command(){
  //Read the command from the commandline
  switch(command){
    case 'set_away':
      on = process.argv[5];
      set_away(on);
    break;
  }
}
//Functions End##############################