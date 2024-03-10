// adding a new bookmark row to the popup
//this executes once you click the popup
import { clear_display, update_time_display, dayOfWeekSelected } from './display_utility.js';
import valid_time from './time_utility.js';
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    function round_down(event) {
        const val_min = parseInt(event.target.value.substring(3, 5));
        let rounded_min = String(Math.floor(val_min / 15) * 15);
        if (rounded_min.length == 1) {
            rounded_min = "0" + rounded_min;
        }
        const final_time = event.target.value.substring(0, 3) + rounded_min;
        document.getElementById(event.target.id).value = final_time;
    }
    
async function save() {
    const startTime = document.getElementById("clock_in").value;
    const endTime = document.getElementById("clock_out").value;

    const new_times = valid_time(startTime, endTime)
    if (!new_times) {
        return;
    }
    const [new_start, new_end] = new_times;
    const dayOfWeek = document.getElementsByClassName("selected")[0].id;
    const shift = {
        "start": new_start,
        "end": new_end
    }
    chrome.storage.local.get(null, (data) => {
        let data_mut = data[dayOfWeek];
        let num_keys = Object.keys(data[dayOfWeek]).length;
        data_mut[(num_keys + 1).toString()] = shift;
        data_mut['status'] = 'set';
        chrome.storage.local.set({ [dayOfWeek]: data_mut })
        update_time_display();
    })
}

async function populate() {
    await populate_action();
}
async function populate_action() {
    let message = {
        action: "EXECUTE",
    }
    function set_stack(items) {
        console.log(items);
        try{
            delete items['stack']['stack'];
        } catch(e) {
            console.log(e)
        } finally {
            chrome.storage.local.set({ "stack": items })
            .then(() => {
                chrome.tabs.sendMessage(tabs[0].id, message);
            })
        }
    }

    function remove_status(items) {
        const item_keys = Object.keys(items)
        item_keys.forEach(weekday=>{
            if(weekday != "stack") {
                if(items[weekday].hasOwnProperty("status")) {
                    delete items[weekday]["status"];
                }
            }
        })
    }
    chrome.storage.local.get(null, (items) => {
        remove_status(items);
        set_stack(items);
    })

}
    
    function initialize() {
        console.log('init')
        document.getElementById('populate').onclick = populate;
        document.getElementById("save_item").onclick = save;
        document.getElementById("clear").onclick = clear_display;

        document.getElementById("clock_in").addEventListener("input", round_down);
        document.getElementById("clock_out").addEventListener("input", round_down);
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        chrome.storage.local.get('Mon', function (items) {
            if (items.Mon == undefined) {
                weekdays.forEach((weekday) => {
                    chrome.storage.local.set({
                        [weekday]: {
                            status: "not set"
                        }
                    })
                });
            }
        });

        const daysOfWeek = document.getElementsByClassName("day_of_week");
        for (let i = 0; i < daysOfWeek.length; i++) {
            daysOfWeek[i].addEventListener('click', (e) => dayOfWeekSelected(e));
        }
        update_time_display();
    }

    initialize();
})