Module.register("MMM-FostPlus-RecyclingCalendar", {

    defaults: {
        zipcode: "8500",
        streetName: "Sint-Martens-Latemlaan",
        streetNumber: "2",
    },

    getScripts: function () {
        return ["moment.js"];
    },

    getTranslations() {
        return {
            en: "translations/en.json",
            nl: "translations/nl.json",
        }
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
            language: config.language,
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
        return this.translate("TITLE");
    },

    getDom: function () {
        let wrapper = document.createElement("div");
        wrapper.className = "MMM-FostPlus-RecyclingCalendar";

        if (this.troubles) {
            wrapper.innerHTML = this.translate("GENERAL_ERROR");
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        this.calendarData = this.calendarData.filter(function (item) {
            const [day, month, year] = item.date.split('-');
            const itemDate = new Date(`${year}-${month}-${day}`);
            const currentDate = new Date();

            return itemDate >= currentDate;
        });

        for (let i = 0; i < 5; i++) {
            const pickupContainer = document.createElement("div");
            pickupContainer.classList.add("binday-container");

            const dateContainer = document.createElement("span");
            dateContainer.classList.add("binday-date");

            dateContainer.innerHTML = `${this.calendarData[i].date}: ${this.calendarData[i].fraction}`;
            pickupContainer.appendChild(dateContainer);

            const iconContainer = document.createElement("span");
            iconContainer.classList.add("binday-icon-container");
            iconContainer.appendChild(this.getIconByTrashType(this.calendarData[i].fractionLogoName));
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
            case "Paper":
                return "https://assets.recycleapp.be/public/b929170f-073a-45eb-98f5-24469fddb287-paper-reversed@3x.png";
            case "PMD":
                return "https://assets.recycleapp.be/public/c28fda62-2d92-4cc5-81c4-3a4979ec2500-pmd-reversed@3x.png";
            case "Biodegradable waste":
                return "https://assets.recycleapp.be/public/7dff44b1-599b-4afe-807a-64a2671eff79-gft-reversed@3x.png";
            case "Glass":
                return "https://assets.recycleapp.be/public/a703d552-a9e7-496f-84e2-cff779bb0883-glass-reversed@3x.png";
            case "Pruning waste (demand)":
                return "https://assets.recycleapp.be/public/33110069-9ac0-4b91-9e07-aebf787bc534-pruningWasteDemand-reversed@3x.png";
            case "Green waste":
                return "https://assets.recycleapp.be/public/e38d7d6e-daa0-430a-acde-421209fef89d-greenWaste-reversed@3x.png";
            case "Large household waste (demand)":
                return "https://assets.recycleapp.be/public/44cbc594-0624-4ed7-aec8-852ad2f8b914-largeHouseholdWasteDemand-reversed@3x.png";
            case "Non-recyclable waste bag":
                return "https://assets.recycleapp.be/public/0298bd59-e740-41b4-94fe-3c605622bc5b-householdBag-reversed@3x.png";
            default:
                return "";
        }
    }
});