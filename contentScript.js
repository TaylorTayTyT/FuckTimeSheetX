(() => {
    function execute() {
        let params = new URLSearchParams(document.location.href.split('?')[1]);
        const id = params.get("TsId");
        params.append("fuckTimesheet", "True");
        params = encodeURIComponent(params);
        document.location.href = `https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=${id}&add=true#entries${params}`;
    }
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.action == "EXECUTE") {
            execute(obj)
        }
    });
}

)();