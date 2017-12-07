var heatmiser = require('heatmiser');

var host = 'localhost';
var pin = 1234;

process.argv.forEach(function (val, index, array) {
  switch(index){
  	case 2:
  		host = val;
  	break;
  	case 3:
  		pin = val;
  	break;
  }
});

var hm = new heatmiser.Wifi(host, pin);

hm.on('success', function(data) {
  console.log(data);
});
hm.on('error', function(data) {
  console.log(data);
});

hm.read_device();