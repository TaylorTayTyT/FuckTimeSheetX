//this exectues on page refresh
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tab.url);

  //base url is: https://johnshopkins.employment.ngwebsolutions.com/
  //Tsx_StuManageTimesheet.aspx?TsId=894518
  if (tab.url.includes("add=true#entries") && tab.url.includes("fuckTimesheet=True")) {
    const times = [
      {
        start_hour: 8,
        start_reference: "am",
        end_hour: 9,
        end_reference: "am"
      }
    ]
    chrome.tabs.sendMessage(tabId, {
      action: "SET_TIMES", 
      times : times
    });
  }
  chrome.tabs.sendMessage(tabId, "tabID");
})