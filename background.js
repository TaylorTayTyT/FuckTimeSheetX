

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
  let params = new URLSearchParams(decodeURIComponent(tab.url.split('?')[1]));
  if (tab.url.includes("add=true#entries") && params.has("fuckTimesheet")) {
    const times_JSON = JSON.parse(params.get("times"));
    
    const start = times_JSON.items[1].split(":");
    let start_reference = "AM";
    const end = times_JSON.items[0].split(":");
    let start_hour = parseInt(start[0]);
    if(start_hour >= 12){
      start_reference = "PM";
      if(start_hour != 12) start_hour -= 12 
    }

    const day = times_JSON.day;

    let start_min = parseInt(start[1]);
    if(start_min == 0) {
      start_min = "00"
    }else{
      start_min = String(start_min);
    }
    let end_hour = parseInt(end[0]);
    let end_min = parseInt(end[1]);
    if(end_min == 0) {
      end_min = "00";
    }else{
      end_min = String(end_hour)
    }
    let end_reference = "AM";
    if(end_hour >= 12){
      end_reference = "PM";
      if(end_hour != 12) end_hour -= 12 
    }

    const times = 
      {
        start_hour: start_hour,
        start_min: start_min,
        start_reference: start_reference,
        end_hour: end_hour,
        end_min: end_min,
        end_reference: end_reference,
        day: day
      }

      
    

    chrome.tabs.sendMessage(tabId, {
      action: "SET_TIMES", 
      times : times,
    });
  }
})