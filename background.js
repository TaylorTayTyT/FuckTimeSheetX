

//this exectues on page refresh
chrome.storage.onChanged.addListener((changes, namespace) => {
  /** 
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if(key != "stack") {
      chrome.storage.local.get(null, (items)=>{
        chrome.storage.local.set({"stack": items})
      })
    }
  }*/
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  function format_times(times_JSON){
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
      return times;
  }
  let params = new URLSearchParams(decodeURIComponent(tab.url.split('?')[1]));
  //this is meant to check if there are still items in the stack, then we should continue add times
  //careful this can end in an infinite looop 
  /** 
  if(tab.url.includes("https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=")){
    chrome.storage.local.get(["stack"], (items)=>{
      if(items != null) {
        chrome.tabs.sendMessage(tabId, {
          action: "EXECUTE", 
        });
      }
    })
  }*/

  if (tab.url.includes("add=true#entries") && params.has("fuckTimesheet")) {
    chrome.storage.local.get(["stack"], (items)=>{
      const stack = items.stack; 
      
    })

    /** 
    const times_JSON = JSON.parse(params.get("times"));
    let times = format_times(times_JSON);
      
    chrome.tabs.sendMessage(tabId, {
      action: "SET_TIMES", 
      times : times,
    });
    alert('second')
    chrome.tabs.sendMessage(tabId, {
      action: "SET_TIMES", 
      times : times,
    });
    */
  }
})