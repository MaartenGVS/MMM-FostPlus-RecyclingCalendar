const NodeHelper = require("node_helper");
const exec = require('child_process').exec;

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper: " + this.name);
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_CALENDAR") {
            this.getCalendar(payload);
        }
    },
    getCalendar: function (payload) {
        const self = this;
        exec('node ' + __dirname + `/scraper/script.js ${payload.language} ${payload.zipcode}  ${payload.streetName}  ${payload.streetNumber}`, (error, stdout, stderr) => {
            if (stdout.toString().includes("Error") || error) {
                self.sendSocketNotification("ERROR");
                return;
            }
            self.sendSocketNotification("CALENDAR_FETCHED", stdout);
        });
    }
});
