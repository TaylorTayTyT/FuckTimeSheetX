

//this exectues on page refresh
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.includes("add=true#entries") && tab.url.includes(encodeURIComponent("fuckTimesheet=True"))) {
    let params = new URLSearchParams(decodeURIComponent(tab.url.split('?')[1]));
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
      times : times,
      items: decodeURIComponent(params.get("items"))
    });
  }
  chrome.tabs.sendMessage(tabId, "tabID");
})