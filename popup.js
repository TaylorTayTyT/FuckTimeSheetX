// adding a new bookmark row to the popup
//this executes once you click the popup
import { clear_display, update_time_display, dayOfWeekSelected, calculate_total_time } from './display_utility.js';
import valid_time from './time_utility.js';
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    /**
     * automatically rounds down the time input to the nearest 15 minute interval
     * @param {Object} event the submit event during time input
     */
    function round_down(event) {
        const val_min = parseInt(event.target.value.substring(3, 5));
        let rounded_min = String(Math.floor(val_min / 15) * 15);
        if (rounded_min.length == 1) {
            rounded_min = "0" + rounded_min;
        }
        const final_time = event.target.value.substring(0, 3) + rounded_min;
        document.getElementById(event.target.id).value = final_time;
    }
    /**
     * saves the time in the dom input
     */
    async function save() {
        const startTime = document.getElementById("clock_in").value;
        const endTime = document.getElementById("clock_out").value;
        const dayOfWeek = document.getElementsByClassName("selected")[0].id;

        const new_times = valid_time(startTime, endTime, dayOfWeek)

        const startHour = parseInt(startTime.substring(0, 2));
        const endHour = parseInt(endTime.substring(0, 2));
        const startMin = parseInt(startTime.substring(3, 5));
        const endMin = parseInt(endTime.substring(3, 5));

        chrome.storage.local.get(dayOfWeek, (items) => {
            for (let item in items[dayOfWeek]) {
                console.log(item)
                if (item == "status") continue;
                const { end, start } = items[dayOfWeek][item];
                let [item_start_hour, item_start_min] = start.split(":").map((elem) => parseInt(elem));
                let [item_end_hour, item_end_min] = end.split(":").map((elem) => parseInt(elem));

                console.log(`end: ${endTime}, start: ${startTime}`);
                console.log(`item_end${end}, item_start${start}`)

                function time_is_before(){
                    if(endHour < item_start_hour) return true; 
                    if(endHour > item_start_hour) return false; 
                    if(endMin < item_end_min) return true; 
                    return false; 
                }

                function time_is_after(){
                    if(startHour > item_end_hour) return true; 
                    if(startHour < item_end_hour) return false; 
                    if(startMin > item_end_min) return true; 
                    return false; 
                }

                if (!(time_is_after() || time_is_before())) {
                    return;
                }

                if (!new_times) {
                    return;
                }
            }
            const [new_start, new_end] = new_times;
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
        });

    }
    /**
     * start putting times into TimesheetX
     */
    async function populate() {
        await populate_action();
    }
    /**
     * helper function to populate, creates the stack of times needed to be inputted
     */
    async function populate_action() {
        let message = {
            action: "EXECUTE",
        }
        //prepare the stack so the background knows what information to send
        function set_stack(items) {
            try {
                delete items['stack']['stack'];
            } catch (e) {
                console.log(e)
            } finally {
                chrome.storage.local.set({ "stack": items })
                    .then(() => {
                        chrome.tabs.sendMessage(tabs[0].id, message);
                    })
            }
        }
        /**
         * removes the status property from each weekday
         * @param {Object} items object that contains each weekday and their times
         */
        function remove_status(items) {
            const item_keys = Object.keys(items)
            item_keys.forEach(weekday => {
                if (weekday != "stack") {
                    if (items[weekday].hasOwnProperty("status")) {
                        delete items[weekday]["status"];
                    }
                    if (Object.keys(items[weekday]).length == 0) {
                        delete items[weekday];
                    }
                }
            })
        }
        chrome.storage.local.get(null, (items) => {
            remove_status(items);
            set_stack(items);
        })
    }

    /**
     * Clears the stack.
     */
    function clear_stack() {
        chrome.storage.local.remove("clear");
    }
    /**
     * initialize the popup
     */
    function initialize() {
        document.getElementById('populate').onclick = populate;
        document.getElementById("save_item").onclick = save;
        document.getElementById("clear").onclick = clear_display;
        document.getElementById("clear_stack").onclick = clear_stack;

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