export function clear_display() {
    const curr_day = document.getElementsByClassName("selected")[0].id;
    chrome.storage.local.set({ [curr_day]: { "status": "unset" } });
    document.getElementById("saved_times").innerHTML = "";
}

function convert_to_standard_time(time) {
    const time_arr = time.split(":");
    let hour = parseInt(time_arr[0]);
    let min = time_arr[1];
    console.log(min)
    if (parseInt(min) == 0) {
        min = "00";
    }
    if (hour == 12) {
        return `${hour}:${min} PM`;
    }
    if (hour > 12) {
        hour -= 12;
        return `${hour}:${min} PM`;
    };
    return time + " AM";
}

export function display(time) {
    const newElement = document.createElement('div');
    const day_w = document.querySelector(".selected").id;
    newElement.id = `Time_item_${day_w}_${String(time.start)}`;
    newElement.classList.add("added_time");
    const time_text = `start: ${convert_to_standard_time(time.start)} \n end: ${convert_to_standard_time(time.end)}`;
    newElement.innerText = time_text;
    document.getElementById("saved_times").appendChild(newElement);
    newElement.addEventListener('mouseenter', () => {
        const cancelElement = document.createElement('img');
        cancelElement.src = "./assets/cancel.png";
        cancelElement.classList.add("cancel");
        newElement.prepend(cancelElement);
        cancelElement.addEventListener('click', (e) => {
            const newElementArr = newElement.id.split('_');
            const day_w = newElementArr[2];
            const start = newElementArr[3];
            chrome.storage.local.get(day_w, (items) => {
                for (let key in items[day_w]) {
                    if (items[day_w][key].start == start) {
                        delete items[day_w][key];
                        chrome.storage.local.set({ [day_w]: items[day_w] })
                        .then(()=> update_time_display())
                        return;
                    }
                }
            })
            //newElement.remove();
            
        })
    });
    newElement.addEventListener('mouseleave', () => {
        const cancel = document.querySelector(".cancel");
        cancel.remove();
    })
}
export function update_time_display() {
    calculate_total_time(); 
    try {
        document.getElementById("saved_times").innerHTML = "";
        const curr_day = document.getElementsByClassName("selected")[0].id;
        chrome.storage.local.get(curr_day, (results) => {
            if (!results[curr_day]) return
            let time_keys = Object.keys(results[curr_day]);
            time_keys.pop();
            time_keys.forEach((element) => {
                display(results[curr_day][element]);
            })
        })
    } catch (e) {
        console.log(e)
    }
}

export function dayOfWeekSelected(event) {
    const daysOfWeek = document.getElementsByClassName("day_of_week");
    for (let i = 0; i < daysOfWeek.length; i++) {
        daysOfWeek[i].classList.remove("selected");
    }
    event.target.classList.add('selected');
    update_time_display();
}
//HH:MM
//this will only return the minutes
function calculate_time(start, end) {
    const [start_hour, start_min] = start.split(":").map(element => parseInt(element));
    const [end_hour, end_min] = end.split(":").map(element => parseInt(element));


    const difference = (end_hour * 60 + end_min) - (start_hour * 60 + start_min);
    return difference;
}

export function calculate_total_time() {
    const weekday_table = {
        "Mon": 0,
        "Tue": 1,
        "Wed": 2,
        "Thu": 3,
        "Fri": 4,
        "Sat": 5,
        "Sun": 6
    }
    let total_time = 0;
    chrome.storage.local.get(null, (items) => {
        for (let weekday in weekday_table) {
            if (weekday == "stack") continue;
            for (let shift in items[weekday]) {
                if (shift == "status") continue;
                let curr_shift = items[weekday][shift];
                console.log(curr_shift)
                total_time += calculate_time(curr_shift.start, curr_shift.end);
            }
        }
        console.log(total_time)
        let total_time_hr = Math.floor(total_time / 60);
        let total_time_min = total_time % 60;
        document.getElementById("total_time").innerText = `Total Time: ${total_time_hr}:${total_time_min} hrs`
    });
}

