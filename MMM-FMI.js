/* Magic Mirror
 *
 * Module: MMM-FMI
 *
 * By Mykle1 - Original idea/code by Cowboysdude. (Used by permission)
 * MIT License
 */
Module.register("MMM-FMI", {

    // Module config defaults.
    defaults: {
        maxWidth: "50%",
        animationSpeed: 1000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        email: "",
        pass: "",
        lat: "",
        lon: "",
        title: "",
 //       voice: "no",
    },

    getStyles: function() {
        return ["MMM-FMI.css"];
    },

    start: function() {

        self = this;
        this.FMI = {};
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("CONFIG", this.config);
        this.scheduleUpdate();
    },


    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Find My iPhone";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }


        // title instead of header so you don't get the header underlined?
        if (this.config,title != ""){
        var title = document.createElement("div");
        title.classList.add("small", "bright", "title");
        title.innerHTML = this.config.title;
        wrapper.appendChild(title);
        }


        var button = document.createElement("button");
        button.innerHTML = "<img src = modules/MMM-FMI/images/icon.png height=15% width=15%>";
   //   button.innerHTML = '<button class="button">Find My iPhone!</button>';
        button.className = ('button');
		button.addEventListener("click", () =>  this.getFMI(this));
        button.addEventListener("click", () =>   this.alertBox());
        wrapper.appendChild(button);


        if (this.DIS != null){


          var label = document.createElement("div");
          label.classList.add("xsmall", "bright", "label");
          label.innerHTML = "iPhone is at these coordinates";
          wrapper.appendChild(label);


          var latitude = document.createElement("div");
          latitude.classList.add("xsmall", "bright", "latitude");
          latitude.innerHTML = "Latitude:  &nbsp" + this.DIS[1].location.latitude;
          wrapper.appendChild(latitude);


          var longitude = document.createElement("div");
          longitude.classList.add("xsmall", "bright", "longitude");
          longitude.innerHTML = "Longitude:  &nbsp" +  this.DIS[1].location.longitude;
          wrapper.appendChild(longitude);

          var batteryLevel = document.createElement("div");
          batteryLevel.classList.add("xsmall", "bright", "battery");
          batteryLevel.innerHTML = "Battery power:  &nbsp" +  this.DIS[1].batteryLevel;
          wrapper.appendChild(batteryLevel);

        }

       if (this.DIS != null){
           var reset = document.createElement("button");
           reset.innerHTML = '<button class="button">Reset "Find My iPhone"</button>';
           reset.className = ('reset');
           reset.addEventListener("click", () =>  label.style.display = "none"); // All credit to Baby Jesus haha
           reset.addEventListener("click", () =>  latitude.style.display = "none"); // All credit to Baby Jesus haha
           reset.addEventListener("click", () =>  longitude.style.display = "none"); // All credit to Baby Jesus haha
           reset.addEventListener("click", () =>  batteryLevel.style.display = "none"); // All credit to Baby Jesus haha
           reset.addEventListener("click", () =>  reset.style.display = "none");    // All credit to Baby Jesus haha
           wrapper.appendChild(reset);
       }

//    }

        return wrapper;
    },

    /////  Add this function to the modules you want to control with voice (Hello-Lucy) //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_PHONE') {
            this.hide(1000);
        }  else if (notification === 'SHOW_PHONE') {
            this.show(1000);
        }
    },


    alertBox: function() {
        alert ("I'm looking for your iPhone!\n\nDid you simply misplace it?\n\nDid some motherfucker take it?!\n\nI'll send a loud beep!\n\nI'll tell you its location.\n\nJust click OK"); // (this.LOC) not working. Comes before data
    },


    processFMI: function(data) {
        this.FMI = data;
//        console.log(this.FMI);

    },
     processLOC: function(data) {
        this.LOC = data;
//        console.log(this.LOC);
    },

     processDIS: function(data) {
        this.DIS = data;
        console.log(this.DIS);
    },

    scheduleUpdate: function() {
        setInterval(() => {
        }, this.config.updateInterval);
        this.loaded = true;
    },

    getFMI: function() {
        this.sendSocketNotification('GET_FMI');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FMI_RESULT") {
            this.processFMI(payload);
        }
        if (notification === "FMI_LOCATION"){
            this.processLOC(payload);
        }
        if (notification === "FMI_DISTANCE"){
            this.processDIS(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
