(() => {
    function execute() {
        let params = new URLSearchParams(document.location.href.split('?')[1]);
        const id = params.get("TsId");
        params.append("fuckTimesheet", "True");
        params = encodeURIComponent(params);

        document.location.href = `https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=${id}&add=true#entries${params}`;
    }
    function set_times(obj) {
        let items = JSON.parse(obj.items);
        console.log(items)

        const working_time = obj.times.pop();
        const date = document.getElementById("Skin_body_ctl01_WDL")
        date.value = "3/5/2024 12:00:00 AM";
        //start time
        document.getElementById("Skin_body_ctl01_StartHour1").value = working_time.start_hour;
        document.getElementById("Skin_body_ctl01_StartMinute1").value = 30
        document.getElementById("Skin_body_ctl01_StartAmPm1").value = "PM"

        //end time
        document.getElementById("Skin_body_ctl01_EndHour1").value = working_time.end_hour;
        document.getElementById("Skin_body_ctl01_EndMinute1").value = "00";
        document.getElementById("Skin_body_ctl01_EndAmPm1").value = "PM"
        document.getElementById("Skin_body_ctl01_ctl05").click();
    }
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.action == "PREP_EXECUTE") {
            window.localStorage.setItem("values", JSON.stringify(obj.items));
            
        }

        if (obj.action == "EXECUTE") {
            execute(obj)
        }
        if (obj.action == 'SET_TIMES') {
            set_times(obj);
        }
    });
}

)();