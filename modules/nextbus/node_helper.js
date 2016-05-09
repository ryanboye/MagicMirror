var NodeHelper = require("node_helper");
var request = require('request');
var departureRegex = /DepartureTime>(.*)<\/DepartureTime>/gm;

var CorbettInbound37 = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=deb90e07-e3af-4302-96fc-6b51862aaafc&stopcode=14177";
var CorbettInbound33 = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=deb90e07-e3af-4302-96fc-6b51862aaafc&stopcode=14075";

module.exports = NodeHelper.create({
    start: function() {
        var self = this;
        self.sendSocketNotification('STARTING UP', "Node bus has started. Beep beep!");
        function getMatches(string, regex, index) {
          index || (index = 1); // default to the first capturing group
          var matches = [];
          var match;
          while (match = regex.exec(string)) {
            matches.push(match[index]);
          }
          return matches;
        }

        function update37(){
            request(CorbettInbound37, function (error, response, body) {
              if (!error && response.statusCode == 200) {        
                var times37 = getMatches(body, departureRegex, 0);
                console.log(times37);
                debugger;
                self.sendSocketNotification('37_TIMES', JSON.stringify(times37));
              }
            })
        }

        function update33(){    
            request(CorbettInbound33, function (error, response, body) {
              if (!error && response.statusCode == 200) {        
                var times33 = getMatches(body, departureRegex, 0);
                console.log(times33);
                self.sendSocketNotification('33_TIMES', JSON.stringify(times33));
              }
            })
        }
        setInterval(function() {
            update37(self)
            update33(self);
        }, 5000); //perform every 1000 milliseconds.
    },
    SocketNotificationReceived: function(notification, payload) {
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    },
    broadcastFeeds: function(notification, payload) {
        this.sendSocketNotification(notification, payload);
    }
});