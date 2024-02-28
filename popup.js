// adding a new bookmark row to the popup
//this executes once you click the popup
import {valid_time} from "./utiliy.js"
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    function clear_display(){
        const saved_times = document.getElementById('saved_times');
        saved_times.innerHTML = "";
    }
    function update_time_display() {
        clear_display(); 
        const curr_day = document.getElementsByClassName("selected")[0].id;
        chrome.storage.local.get(null, function (items) {
            const allKeys = Object.keys(items);
            let app_keys = [];
            for (let i = 0; i < allKeys.length; i++) {
                if (allKeys[i].includes(curr_day)) {
                    app_keys.push(allKeys[i]);
                }
            }
            app_keys.forEach(element => {
                chrome.storage.local.get(element, (result) => {
                    const saved_times = document.getElementById("saved_times");
                    const new_elem = document.createElement("div");
                    new_elem.innerText = element.toString() + " " + result[element]['end'];
                    saved_times.appendChild(new_elem);
                })

            })
        })
    }
    function save() {
        const startTime = document.getElementById("clock_in").value;
        const endTime = document.getElementById("clock_out").value;
        if(!valid_time()){
            return; 
        }
        const dayOfWeek = document.getElementsByClassName("selected")[0].id;
        const storageID = dayOfWeek + " " + startTime;
        const shift = {
            "start": startTime,
            "end": endTime
        }
        chrome.storage.local.set({ [storageID]: shift });
        update_time_display();

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
        console.log('will_populate');
        chrome.tabs.sendMessage(tabs[0].id, "EXECUTE");
    }
    function initialize() {
        document.getElementById('populate').onclick = populate;
        document.getElementById("save_item").onclick = save;
        document.getElementById("clear").onclick = ()=>{
            chrome.storage.local.clear(); 
            update_time_display(); 
        } 
        const daysOfWeek = document.getElementsByClassName("day_of_week");
        for (let i = 0; i < daysOfWeek.length; i++) {
            daysOfWeek[i].addEventListener('click', (e) => dayOfWeekSelected(e));
        }
        update_time_display();
    }

    initialize();
})