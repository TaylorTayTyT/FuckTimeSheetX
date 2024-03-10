chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tab.url)
  function format_times(times_JSON) {
    const start = times_JSON.items[1].split(":");
    let start_reference = "AM";
    const end = times_JSON.items[0].split(":");
    let start_hour = parseInt(start[0]);
    if (start_hour >= 12) {
      start_reference = "PM";
      if (start_hour != 12) start_hour -= 12
    }

    const day = times_JSON.day;

    let start_min = parseInt(start[1]);
    if (start_min == 0) {
      start_min = "00"
    } else {
      start_min = String(start_min);
    }
    let end_hour = parseInt(end[0]);
    let end_min = parseInt(end[1]);
    if (end_min == 0) {
      end_min = "00";
    } else {
      end_min = String(end_hour)
    }
    let end_reference = "AM";
    if (end_hour >= 12) {
      end_reference = "PM";
      if (end_hour != 12) end_hour -= 12
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
  //careful this can end in an infinite loop 
  
  if (tab.url.toLowerCase().includes("https://johnshopkins.employment.ngwebsolutions.com/Tsx_StuManageTimesheet.aspx?TsId".toLowerCase())) {
    //ok i googled this and to delete an element in chrome storage i have to remove the whole things and add 
    // a new object
    console.log('entered')
    chrome.storage.local.get("stack", (items) => {
      console.log(items)
      if(items.stack.hasOwnProperty("stack")) delete items.stack.stack
      if(!items) return;
      let times = {};

      if(items.hasOwnProperty("Mon")){
        let time_key = Object.keys(items.Mon)[0]
        times = items.Mon[time_key];
        delete items.Mon[time_key];
      } else if(items.hasOwnProperty("Tue")){

      }
      else if(items.hasOwnProperty("Wed")){
        
      }
      else if(items.hasOwnProperty("Thu")){
        
      }
      else if(items.hasOwnProperty("Fri")){
        
      }
      else if(items.hasOwnProperty("Sat")){
        
      }
      else if(items.hasOwnProperty("Sun")){
        
      }
      else{
        console.log('error in stack')
      }
      //update the stack
      chrome.tabs.remove("stack")
      .then(()=>{
        chrome.tabs.set({"stack": items});
      });

      chrome.tabs.sendMessage(tabId, {
        action: "SET_TIMES", 
        times : times,
      });

    })
  }

  else if (tab.url.includes("add=true#entries") && params.has("fuckTimesheet")) {
    chrome.storage.local.get(["stack"], (items) => {
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