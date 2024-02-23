//this exectues on page refresh
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tab.url);

  //base url is: https://johnshopkins.employment.ngwebsolutions.com/
  //Tsx_StuManageTimesheet.aspx?TsId=894518
  if (tab.url.includes("add=true#entries") && tab.url.includes("fuckTimesheet=True")) {
    chrome.tabs.sendMessage(tabId, "SET_TIMES");
  }
  chrome.tabs.sendMessage(tabId, "tabID");
})