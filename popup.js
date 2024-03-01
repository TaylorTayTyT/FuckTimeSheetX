// adding a new bookmark row to the popup
//this executes once you click the popup
import valid_time from './utility.js';
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    function clear_display() {
        const curr_day = document.getElementsByClassName("selected")[0].id;
        chrome.storage.local.set({[curr_day]: {"status": "unset"}});
        document.getElementById("saved_times").innerHTML = "";
    }
    function display(time) {
        const newElement = document.createElement('div');
        newElement.classList.add("added_time");
        const time_text = `start: ${time.start} \t end: ${time.end}`;
        newElement.innerText = time_text;
        document.getElementById("saved_times").appendChild(newElement);
    }
    function update_time_display() {
        document.getElementById("saved_times").innerHTML = "";
        const curr_day = document.getElementsByClassName("selected")[0].id;
        chrome.storage.local.get(curr_day, (results)=> {
            let time_keys = Object.keys(results[curr_day]); 
            time_keys.pop(); 
            time_keys.forEach((element) => {
                display(results[curr_day][element]);
            })
        })
    }
    async function save() {
        const startTime = document.getElementById("clock_in").value;
        const endTime = document.getElementById("clock_out").value;
        //check if appropritate time TODO
        const dayOfWeek = document.getElementsByClassName("selected")[0].id;
        const shift = {
            "start": startTime,
            "end": endTime
        }
        chrome.storage.local.get(null, (data) => {
            let data_mut = data[dayOfWeek];
            let num_keys = Object.keys(data[dayOfWeek]).length;
            data_mut[(num_keys + 1).toString()] = shift;
            data_mut['status'] = 'set';
            chrome.storage.local.set({[dayOfWeek]: data_mut })
            update_time_display();
        })
        

    }
    function dayOfWeekSelected(event) {
        const daysOfWeek = document.getElementsByClassName("day_of_week");
        for (let i = 0; i < daysOfWeek.length; i++) {
            daysOfWeek[i].classList.remove("selected");
        }
        event.target.classList.add('selected');
        update_time_display();
    }
    function populate() {
        chrome.tabs.sendMessage(tabs[0].id, "EXECUTE");
    }
    function initialize() {
        console.log('initializing')
        document.getElementById('populate').onclick = populate;
        document.getElementById("save_item").onclick = save;
        document.getElementById("clear").onclick = clear_display; 
        const weekdays = ['monday', 'tueday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        chrome.storage.local.get('monday', function (items) {
            if (items.monday == undefined) {
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