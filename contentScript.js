(() => {
    function execute(obj) {
        let params = new URLSearchParams(document.location.href.split('?')[1]);
        const id = params.get("TsId");
        params.append("fuckTimesheet", "True");
        params.append("times", JSON.stringify(obj));
        console.log(obj)
        /** 
        params.append("start", obj.items[1]);
        params.append("end", obj.items[0]);
        params.append("day", obj.day);
        */
        params = encodeURIComponent(params);

        document.location.href = `https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=${id}&add=true#entries${params}`;
    }
    function set_times(obj) {
        console.log(obj)
        console.log(obj.times.start_hour)
        
        const date = document.getElementById("Skin_body_ctl01_WDL")
        date.value = "3/5/2024 12:00:00 AM";
        //start time
        document.getElementById("Skin_body_ctl01_StartHour1").value = obj.times.start_hour;
        document.getElementById("Skin_body_ctl01_StartMinute1").value = obj.times.start_min; 
        document.getElementById("Skin_body_ctl01_StartAmPm1").value = obj.times.start_reference; 

        //end time
        document.getElementById("Skin_body_ctl01_EndHour1").value = obj.times.end_hour;
        document.getElementById("Skin_body_ctl01_EndMinute1").value = obj.times.end_min;
        document.getElementById("Skin_body_ctl01_EndAmPm1").value = obj.times.end_reference; 
        document.getElementById("Skin_body_ctl01_ctl05").click();
    }
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.action == "PREP_EXECUTE") {
            window.localStorage.setItem("values", JSON.stringify(obj.items));
            
        }

        if (obj.action == "EXECUTE") {
            console.log(obj.items)
            execute(obj)
        }
        if (obj.action == 'SET_TIMES') {
            console.log(obj.times);
            set_times(obj);
        }
    });
}

)();