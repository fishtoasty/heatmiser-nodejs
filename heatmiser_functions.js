function safeguard_hours(hours){
  if (hours < 0){
      hours = 0.5;
  }
  else if (hours > 24){
      hours = 24;
  }

  return hours;
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

function set_away(on){
  var mode = on === 'on' ? 'frost' : 'heating';
  var dcb = {
    run_mode: mode 
  };

  return dcb;
}

function set_keylock(on){
    var lock = on === 'on' ? true : false;

    var dcb = {
      keylock: lock
    };

    return dcb;
}

function set_temperature(temperature){
    temperature = safeguard_temperature(temperature);

    var dcb = {
      heating: {
        target: parseInt(temperature, 10)
      }
    };

    return dcb;
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

    return dcb;
}

module.exports = {set_hold: set_hold, set_temperature: set_temperature, set_keylock: set_keylock, set_away: set_away};