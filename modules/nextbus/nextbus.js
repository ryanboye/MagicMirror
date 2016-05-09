var times37 = [];
var times33 = [];

Module.register("nextbus",{
    // Default module config.
    defaults: {
        text: "No available busses"
    },
    start: function(){

    },
    // Override dom generator.
    getDom: function() {
        var domWrapper = document.createElement("div");        
        genDom(domWrapper);        
        return domWrapper;
    },
    socketNotificationReceived: function(notification, payload) {
        switch(notification){
            case "37_TIMES":
                times37 = JSON.parse(payload);
                self.updateDom();
                break;
            case "33_TIMES":
                times33 = JSON.parse(payload);
                self.updateDom();
                break;
        }

        Log.log(notification);
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    }    
});

function genDom(parent){
    var thirtythree = document.createTextNode("33 Times: ");
    var thirtyseven = document.createTextNode("37 Times: ");

    var wrapper = document.createElement("div");

    wrapper.appendChild(thirtyseven);
    times37.forEach(function(el){
        var node = document.createElement("div");
        var textnode = document.createTextNode(el + " minutes");
        node.appendChild(textnode);
        wrapper.appendChild(node);
    });
    
    wrapper.appendChild(thirtythree);
    
    times33.forEach(function(el){
        var node = document.createElement("div");
        var textnode = document.createTextNode(el + " minutes");
        node.appendChild(textnode);
        wrapper.appendChild(node);
    });

    return parent.appendChild(wrapper);
}