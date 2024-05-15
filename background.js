
/**
 * gives desired weekday's specific date
 * @param {String} day_w input is the day of the week ("Mon", "Tue", etc)
 * @returns the MM/DD/YY 12:00:00am of the inputted day of week
 */
function this_week_dates(day_w) {
  const weekday_table = {
    "Mon": 0,
    "Tue": 1,
    "Wed": 2,
    "Thu": 3,
    "Fri": 4,
    "Sat": 5,
    "Sun": 6
  }
  const months = {
    "Jan": "1",
    "Feb": "2",
    "Mar": "3",
    "Apr": "4",
    "May": "5",
    "Jun": "6",
    "Jul": "7",
    "Aug": "8",
    "Sep": "9",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
  }

  let curr_date = new Date();
  let day_of_week = curr_date.toString().split(" ")[0];

  //changes the curr_date to Monday 
  curr_date.setDate(curr_date.getDate() - weekday_table[day_of_week]);

  let curr_date_trans = new Date(curr_date);
  curr_date_trans.setDate(curr_date_trans.getDate() + weekday_table[day_w]);
  curr_date_trans = curr_date_trans.toString().split(" ");
  let month = months[curr_date_trans[1]];
  let day = curr_date_trans[2];
  day = day.replace(/^0+/, '');
  let year = curr_date_trans[3];
  return `${month}/${day}/${year} 12:00:00 AM`;
}
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
      port.onDisconnect.addListener(function() {
         chrome.storage.local.remove("stack");
      });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  /**
   * format input to send to fill out TimesheetX
   * @param {{start: HH:MM, end: HH:MM, day: MM/DD/YY 12:00:00am}} times_JSON 
   * @returns times = {
    {
      start_hour: start_hour,
      start_min: start_min,
      start_reference: start_reference,
      end_hour: end_hour,
      end_min: end_min,
      end_reference: end_reference,
      day: day
    }}
   */
  function format_times(times_JSON) {
    const start = times_JSON.start.split(":");
    const end = times_JSON.end.split(":");
    let start_reference = "AM";
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
      end_min = String(end_min)
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
    console.log(times);
    return times;
  }
/**
 * Actually manipulates the DOM to set times. 
 * @param {Object} obj 
 */
  function set_times(obj) {
    console.log(obj)

    const weekday_table = {
      "Mon": 0,
      "Tue": 1,
      "Wed": 2,
      "Thu": 3,
      "Fri": 4,
      "Sat": 5,
      "Sun": 6
    }

    const date_table = Array.from(document.getElementById("Skin_body_ctl01_WDL").options);
    const curr_date = date_table[weekday_table[obj.day]].value;

    //date
    document.getElementById("Skin_body_ctl01_WDL").value = curr_date;

    //start time
    document.getElementById("Skin_body_ctl01_StartHour1").value = obj.start_hour;
    document.getElementById("Skin_body_ctl01_StartMinute1").value = obj.start_min;
    document.getElementById("Skin_body_ctl01_StartAmPm1").value = obj.start_reference;

    //end time
    document.getElementById("Skin_body_ctl01_EndHour1").value = obj.end_hour;
    document.getElementById("Skin_body_ctl01_EndMinute1").value = obj.end_min;
    document.getElementById("Skin_body_ctl01_EndAmPm1").value = obj.end_reference;

    document.getElementById("Skin_body_ctl01_ctl05").click();
  }
/** Initiates function that will populate times.
 * 
 * @param {timeObject} shift_interval 
 */
  function pick_one(shift_interval) {
    console.log(shift_interval)
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        args: [shift_interval],
        func: set_times
      })
      .then(() => console.log("script injected"));
  }

  
  if (changeInfo.status == "complete" && tab.url.toLowerCase().includes("add=true#entries".toLowerCase())) {
    //executes steps needed to populate times
    let count = 0;
    chrome.storage.local.get("stack", (items) => {
      if (count > 0) return;
      count += 1;
      if (Object.keys(items).length == 0) return;
      if (items.stack.hasOwnProperty("stack")) delete items.stack.stack // cleaning up
      items = items.stack;
      if (Object.keys(items).length == 0) return;

      const day_w = Object.keys(items)[0];

      const time_key = Object.keys(items[day_w])[0] //used so I can retrieve specific objects from items
      const times = items[day_w][time_key]

      const end_time = times.end;
      const start_time = times.start;
      
  
      //const curr_date = this_week_dates(day_w);

      const shift_interval = {
        start: start_time,
        end: end_time,
        day: day_w
      }
      pick_one(format_times(shift_interval));
      delete items[day_w][time_key];
      if (Object.keys(items[day_w]).length == 0) delete items[day_w];

      //update the stack
      chrome.storage.local.remove("stack")
        .then(() => {
          if (items.stack && Object.keys(items.stack).length == 0) {
            chrome.storage.local.remove("stack");
          }
          else chrome.storage.local.set({ "stack": items });
        });
    })
  }
  else if (changeInfo.status == "complete" && tab.url.toLowerCase().includes("https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=".toLowerCase())) {
    //recursively adds times until stack is empty
    chrome.storage.local.get("stack", (items) => {
      if (!items) return;
      if (Object.keys(items.stack).length == 0) {
        chrome.storage.local.remove("stack");
        return;
      }
      if (!items.stack) return;

      /**
       * redirects to page where you can add details about your shift.
       */
      function clickAddButton() {
        const params = new URLSearchParams(document.location.href.split('?')[1]);
        const id = params.get("TsId");
        console.log(id)
        document.location.href = `https://johnshopkins.employment.ngwebsolutions.com/tsx_stumanagetimesheet.aspx?TsId=${id}&add=true#entries`
      }

      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          args: [],
          func: clickAddButton
        })
        .then(() => console.log('redirecting'));
    })
  }
})

