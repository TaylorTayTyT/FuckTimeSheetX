
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

  function set_times(obj) {
    console.log("setting_times")
    console.log(obj)
    console.log(obj.start_hour)

    const date = document.getElementById("Skin_body_ctl01_WDL")
    date.value = obj.day;

    //data
    document.getElementById("Skin_body_ctl01_WDL").value = obj.day;
    console.log(document.getElementById("Skin_body_ctl01_WDL"));
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

  function pick_one() {
    console.log('picking one')
    chrome.storage.local.get("stack", (items) => {
      //console.log(items)
      if (!items) return
      console.log("LOGGING ITEMS");
      console.log(items);
      const stack = items.stack;
      if (Object.keys(stack).length == 0) return; //checking if there is smth in the stack

      const weekday = Object.keys(stack)[0]; //Mon
      const time_key = Object.keys(stack[weekday])[0] //2
      let { end, start } = stack[weekday][time_key];
      let curr_date = this_week_dates(weekday);
      let times = format_times({
        start: start,
        end: end,
        day: curr_date
      });

      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          args: [times],
          func: set_times
        })
        .then(() => console.log("script injected"));
    })
  }

  if (tab.url.toLowerCase().includes("add=true#entries".toLowerCase())) {
    chrome.storage.local.get("stack", (items) => {
      if (Object.keys(items).length == 0) return;
      if (items.stack.hasOwnProperty("stack")) delete items.stack.stack
      let times = {};
      items = items.stack;
      if (items.hasOwnProperty("Mon")) {
        let time_key = Object.keys(items.Mon)[0]
        times = items.Mon[time_key];
        console.log("deleting vvvvv");
        console.log(items.Mon[time_key]);
        delete items.Mon[time_key];
        if (Object.keys(items.Mon).length == 0) delete items.Mon
        chrome.storage.local.set({ "stack": items });

      } else if (items.hasOwnProperty("Tue")) {

      }
      else if (items.hasOwnProperty("Wed")) {

      }
      else if (items.hasOwnProperty("Thu")) {

      }
      else if (items.hasOwnProperty("Fri")) {

      }
      else if (items.hasOwnProperty("Sat")) {

      }
      else if (items.hasOwnProperty("Sun")) {

      }
      else {
        console.log('Nothing in the stack');
        return chrome.storage.local.remove("stack");
      }
      //update the stack
      chrome.storage.local.remove("stack")
        .then(() => {
          chrome.storage.local.set({ "stack": items });
          pick_one();
        });
    })
  }
})