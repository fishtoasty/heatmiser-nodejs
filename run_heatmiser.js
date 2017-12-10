const Alexa = require('alexa-sdk');
var heatmiser = require('heatmiser');
var heatmiser_functions = require('./heatmiser_functions')

var host = 'localhost';
var pin = 1234;
var command = ''
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
  console.log('Dumping data...')
  console.log(data);
}

function parse_command()
{
  console.log('Parsing command...')
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
    console.log('Writing DCB to thermostat' + JSON.stringify(dcb))
    hm.write_device(dcb);
  }
}

function initialise_heatmiser(success_callback, error_callback){
  console.log('Initialising heatmiser with host: ' + host)
  hm = new heatmiser.Wifi(host, pin);

  hm.on('success', success_callback);
  hm.on('error', error_callback);

  hm.read_device(parse_command);
}

function process_cmdline(){
  console.log('Processing command line...')
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
  console.log('Processing ENVS...')
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
var alexa_instance;
var alexa_response = '';
var alexa_emit = '';

const handlers = {
    'LaunchRequest': function () {
    },
    'SetAwayModeIntent': function () {
        var onoff = this.event.request.intent.slots.onoff.value;
        var direction = this.event.request.intent.slots.direction.value;
        command = "set_away";
        arg1 = (onoff === 'on' || direction === 'leaving') ? 'on' : 'off';

        process_ENVS();
        initialise_heatmiser(alexa_success, alexa_error);

        alexa_instance = this;
        alexa_response = "I have set the away mode " + arg1;
        alexa_emit = ":responseReady";        
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'This is the heatmiser wifi skill.';
        const reprompt = 'Ask Ross how to use this skill if you need help.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Request cancelled!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Request stopped!');
        this.emit(':responseReady');
    }
};

function alexa_success(data){
  dump_data(data);
  if(alexa_instance != null){
    alexa_instance.response.speak(alexa_response);
    alexa_instance.emit(alexa_emit);
  }
}

function alexa_error(data){
  dump_data(data);
  if(alexa_instance != null){
    alexa_instance.response.speak("There was an error connecting to the thermostat!");
    alexa_instance.emit(alexa_emit);
  }
}

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
function initialise_alexa(event, context, callback){
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
}

exports.handler = initialise_alexa;