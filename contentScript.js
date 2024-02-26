(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log(obj);
        console.log(sender);
        if (obj == "EXECUTE") {
            let id = document.location.href.split('=')[1];
            document.location.href = `https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=${id}&add=true#entries&fuckTimesheet=True`;
        }
        if (obj == 'SET_TIMES') {
            const date = document.getElementById("Skin_body_ctl01_WDL")
            date.value = "2/27/2024 12:00:00 AM"

            //start time
            document.getElementById("Skin_body_ctl01_StartHour1").value = 3
            document.getElementById("Skin_body_ctl01_StartMinute1").value = 30
            document.getElementById("Skin_body_ctl01_StartAmPm1").value = "PM"

            //end time
            document.getElementById("Skin_body_ctl01_EndHour1").value = 5
            document.getElementById("Skin_body_ctl01_EndMinute1").value = "00";
            document.getElementById("Skin_body_ctl01_EndAmPm1").value = "PM"
            document.getElementById("Skin_body_ctl01_ctl05").click();
        }
        return true;
    });
}

)();