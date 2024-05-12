export function clear_display() {
    const curr_day = document.getElementsByClassName("selected")[0].id;
    chrome.storage.local.set({ [curr_day]: { "status": "unset" } });
    document.getElementById("saved_times").innerHTML = "";
}
export function display(time) {
    const newElement = document.createElement('div');
    newElement.classList.add("added_time");
    const time_text = `start: ${time.start} \t end: ${time.end}`;
    newElement.innerText = time_text;
    document.getElementById("saved_times").appendChild(newElement);
}
export function update_time_display() {
    try{
    document.getElementById("saved_times").innerHTML = "";
    const curr_day = document.getElementsByClassName("selected")[0].id;
    chrome.storage.local.get(curr_day, (results) => {
        if(!results[curr_day]) return
        let time_keys = Object.keys(results[curr_day]);
        time_keys.pop();
        time_keys.forEach((element) => {
            display(results[curr_day][element]);
        })
    })}catch (e) {
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