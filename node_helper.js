
const NodeHelper = require('node_helper');
var icloud = require("find-my-iphone").findmyphone;

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },


    getFMI: function(url) {
        var self = this;
        var distance = '';
        var duration = '';
        var location = '';
        icloud.apple_id = this.config.email; //this.config.login
        icloud.password = this.config.pass; //this.config.pass 
        
        
        icloud.getDevices(function(error, devices) {
        var device;
 console.log(devices);
        if (error) {
            throw error;
        }
        //pick a device with location and findMyPhone enabled 
        devices.forEach(function(d) {
            if (device == undefined && d.location && d.lostModeCapable) {
                device = d;
            }
        });
 
        if (device) {
 
            //gets the distance of the device from my location 
            var myLatitude = 40.574780;
            var myLongitude = -74.112441;
            var result;
            
            icloud.getDistanceOfDevice(device, myLatitude, myLongitude, function(err, result) {
                console.log("Distance: " + result); // result.distance.text);
                console.log("Driving time: " +  result); // result.duration.text);
                self.sendSocketNotification('FMI_DISTANCE', {result});
            });
 
            icloud.alertDevice(device.id, function(err) {
                console.log("Beep Beep!");
                self.sendSocketNotification('FMI_RESULT', result);
            });
 
            icloud.getLocationOfDevice(device, function(err, location) {
                console.log(location);
                self.sendSocketNotification('FMI_LOCATION', {location});
            });
        }
            
            
            
    });
        

    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'CONFIG'){
			this.config = payload;
		} else if (notification === 'GET_FMI') {
            this.getFMI(payload);
        }
    }
});
