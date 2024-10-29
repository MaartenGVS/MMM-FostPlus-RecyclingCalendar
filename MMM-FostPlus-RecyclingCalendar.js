Module.register("MMM-FostPlus-RecyclingCalendar", {

    defaults: {
        language: "en",
        zipcode: "8500",
        streetName: "Sint-Martens-Latemlaan",
        streetNumber: "2",
    },

    getScripts: function () {
        return ["moment.js"];
    },

    getStyles: function () {
        return ["MMM-FostPlus-RecyclingCalendar.css", "font-awesome.css"];
    },

    start: function () {
        Log.info("Starting module: " + this.name);

        this.loaded = false;
        this.updateCalendar(1000);
    },

    updateCalendar: function () {
        this.sendSocketNotification("GET_CALENDAR", {
            language: this.config.language,
            zipcode: this.config.zipcode,
            streetName: this.config.streetName,
            streetNumber: this.config.streetNumber
        });
        this.updateDom(1000);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "CALENDAR_FETCHED") {
            this.loaded = true;
            this.calendarData = JSON.parse(payload)
            this.updateDom();

        } else if (notification === "ERROR") {
            this.troubles = true;
            this.updateDom();
        }
    },

    getHeader() {
        return "Recycling Calendar";
    },

    getDom: function () {
        let wrapper = document.createElement("div");
        wrapper.className = "MMM-FostPlus-RecyclingCalendar";

        if (this.troubles) {
            wrapper.innerHTML = "Error fetching menu";
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }


        const today = moment().format("DD-MM-YYYY");
        const todayIndex = this.calendarData.findIndex((element) => element.date === today);
        this.calendarData = this.calendarData.slice(todayIndex);


        for (let i = 0; i < this.calendarData.length; i++) {
            const pickupContainer = document.createElement("div");
            pickupContainer.classList.add("binday-container");

            const dateContainer = document.createElement("span");
            dateContainer.classList.add("binday-date");

            dateContainer.innerHTML = `${this.calendarData[i].date}: ${this.calendarData[i].fraction}`;
            pickupContainer.appendChild(dateContainer);

            const iconContainer = document.createElement("span");
            iconContainer.classList.add("binday-icon-container");
            iconContainer.appendChild(this.getIconByTrashType(this.calendarData[i].fraction));
            pickupContainer.appendChild(iconContainer);

            wrapper.appendChild(pickupContainer);
        }
        return wrapper;
    },

    getIconByTrashType: function (trashType) {
        const icon = document.createElement("img");
        icon.src = this.getIconURLByTrashType(trashType);
        icon.classList.add("binday-icon");
        return icon;
    },

    getIconURLByTrashType: function (trashType) {
        switch (trashType) {
            case "Restafval":
            case "Non-recyclable waste":
                return "https://assets.recycleapp.be/public/246e5684-96f9-4732-a45d-4eb949574187-household-reversed@3x.png";
            case "Papier":
            case "Paper":
                return "https://assets.recycleapp.be/public/b929170f-073a-45eb-98f5-24469fddb287-paper-reversed@3x.png";
            case "PMD":
                return "https://assets.recycleapp.be/public/c28fda62-2d92-4cc5-81c4-3a4979ec2500-pmd-reversed@3x.png";
            case "Groente-, fruit-, tuinafval":
            case "Biodegradable waste":
                return "https://assets.recycleapp.be/public/7dff44b1-599b-4afe-807a-64a2671eff79-gft-reversed@3x.png";
            case "Glas":
            case "Glass":
                return "https://assets.recycleapp.be/public/a703d552-a9e7-496f-84e2-cff779bb0883-glass-reversed@3x.png";
            default:
                return "";
        }
    }
});