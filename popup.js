// adding a new bookmark row to the popup

//this executes once you click the popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    function generate_display_time(weekday){

    }

    function update_time_display(){
        const time_display = document.getElementById("saved_times");
        const curr_day = document.getElementsByClassName("selected")[0].id;
        chrome.storage.local.get(null, function(items){
            const allKeys = Object.keys(items);
            let app_keys = [];
            for (let i = 0; i < allKeys.length; i++) {
                if(allKeys[i].includes(curr_day)) {
                    app_keys.push(allKeys[i]);
                }
            }
            app_keys.forEach(element=>{
                const saved_times = document.getElementById("saved_times");
                const new_elem = document.createElement("div");
                new_elem.innerText = element.toString(); 
                console.log(new_elem);
                saved_times.appendChild(new_elem);
            })
        })
    }
    function save(){
        const startTime = document.getElementById("clock_in").value;
        const endTime = document.getElementById("clock_out").value;
        const dayOfWeek = document.getElementsByClassName("selected")[0].id;
        const storageID = dayOfWeek + " " + startTime;
        const shift = {
            "start": startTime, 
            "end": endTime
        }
        chrome.storage.local.set({[storageID]: shift});
        update_time_display(); 

    }
    function dayOfWeekSelected(event) {
        const daysOfWeek = document.getElementsByClassName("day_of_week");
        for (let i = 0; i < daysOfWeek.length; i++) {
            daysOfWeek[i].classList.remove("selected");
        }
        event.target.classList.add('selected');
    }

    function populate() {
        console.log('will_populate');
        chrome.tabs.sendMessage(tabs[0].id, "EXECUTE");
    }
    function initialize() {
        document.getElementById('populate').onclick = populate;
        document.getElementById("save_item").onclick = save;
        const daysOfWeek = document.getElementsByClassName("day_of_week");
        for (let i = 0; i < daysOfWeek.length; i++) {
            daysOfWeek[i].addEventListener('click', (e) => dayOfWeekSelected(e));
        }
    }

    initialize(); 

    /** 
    document.getElementById('save_info_form').addEventListener("submit", (e)=>{
        e.preventDefault(); 
        
        const dayOfWeek = document.getElementById("week").value;
        const startTime = document.getElementById("start_time").value;
        const endTime = document.getElementById("end_time").value;
        const work_info = {
            "day": dayOfWeek, 
            "start": startTime,
            "end": endTime
        }
        chrome.storage.local.set({"1": work_info}, ()=>{
            chrome.storage.local.get(["1"], (result)=>{
                console.log(result);
            })
        });
        console.log(dayOfWeek);
    })*/
})