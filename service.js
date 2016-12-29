function Service(appClient) {
  this.appClient = appClient;
}

Service.prototype.connect = function() {
  // TODO connect to iotf here with this.appClient
  this.appClient.connect();

  this.appClient.on('connect', function() {
    // TODO hook up device events here with this.appClient
    console.log(" application connected to IoT Platform");
    this.appClient.subscribeToDeviceEvents();
  }.bind(this));

  this.appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    // TODO act on device events and call handleTempEvent when the right type of event arrives
    console.log("Device event at " + new Date().toString() + " from " + deviceType +
                          ":" + deviceId + "; event = "+ eventType +", payload = " + payload);
    payload = JSON.parse(payload);
    if (eventType == 'environment') {
      var sensehatTemp = payload.d.temperature;
      this.handleTempEvent(sensehatTemp);
    }
  }.bind(this));
};

Service.prototype.handleTempEvent = function(temp) {
  // TODO handle temperature changes here and call this.warningOn/this.warningOff accordingly.
  // set display variable
  // si temp > 29 et display different de on alors warningon et display on
  // si temp <= 29 et display different de off alors warningOff et display off
  if (temp > 29 && global.display !== "on") {
    global.display = "on";
    this.warningOn();
  }
  if (temp <= 29 && global.display !== "off") {
    global.display = "off";
    this.warningOff();
  }
};

Service.prototype.warningOn = function() {
  // TODO send a device commmand here
  // warningOn should only be called when the warning isn't already on
  console.log("screen on");
  var myData={"screen" : "on"};
  myData = JSON.stringify(myData);
  //this.appClient.publishDeviceCommand("SenseHAT","senb827eb7ddd6d", "display", "json", myData);
  this.appClient.publishDeviceCommand("SenseHat","senCPRaspberryPiGW", "display", "json", myData);
};

Service.prototype.warningOff = function() {
  // TODO send a device commmand here
  // warningOff should only be called when the warning isn't already off
  console.log("screen off");
  var myData={"screen" : "off"};
  myData = JSON.stringify(myData);
  //this.appClient.publishDeviceCommand("SenseHAT","senb827eb7ddd6d", "display", "json", myData);
  this.appClient.publishDeviceCommand("SenseHat","senCPRaspberryPiGW", "display", "json", myData);
};

module.exports = Service;
