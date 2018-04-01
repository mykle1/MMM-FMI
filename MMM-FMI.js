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
            wrapper.innerHTML = "Getting your Iphone location. . .";
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
        
        
		wrapper.appendChild(button);
        
        if (this.LOC != null){
            var location = document.createElement("div");
            location.classList.add("xsmall", "bright", "location");
            location.innerHTML = this.LOC.location;
//            self.updateDom;
            wrapper.appendChild(location);
        }
        
        if (this.DIS != null){
            var distance = document.createElement("div");
            distance.classList.add("xsmall", "bright", "distance");
            distance.innerHTML = "Distance to your iPhone is " + this.DIS.result.distance.text;
//            self.updateDom;
            wrapper.appendChild(distance);
        }
        
       if (this.DIS != null){ 
           var reset = document.createElement("button");
           reset.innerHTML = '<button class="button">Reset this module!</button>';
           reset.className = ('reset');
		   reset.addEventListener("click", () =>  distance.style.display = "none"); // All credit to Baby Jesus haha
           reset.addEventListener("click", () =>  location.style.display = "none"); // All credit to Baby Jesus haha
           reset.addEventListener("click", () =>  reset.style.display = "none");    // All credit to Baby Jesus haha
           wrapper.appendChild(reset);
       }
                        
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
        alert ("I'm looking for your iPhone!\n\nDid you simply misplace it?\n\nOr did some motherfucker take it?!\n\nClick OK for the location!"); // (this.LOC) not working. Comes before data
    },
    
    processFMI: function(data) {
        this.FMI = data;
 //       console.log(this.FMI);
        
    },
     processLOC: function(data) {
        this.LOC = data;
//        console.log(this.LOC); 
    },
    
     processDIS: function(data) {
        this.DIS = data;
//        console.log(this.DIS); 
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
