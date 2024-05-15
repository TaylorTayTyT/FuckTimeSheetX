export function clear_display() {
    const curr_day = document.getElementsByClassName("selected")[0].id;
    chrome.storage.local.set({ [curr_day]: { "status": "unset" } });
    document.getElementById("saved_times").innerHTML = "";
}
export function display(time) {
    const newElement = document.createElement('div');
    const day_w = document.querySelector(".selected").id; 
    newElement.id = `Time_item_${day_w}_${String(time.start)}`;
    newElement.classList.add("added_time");
    const time_text = `start: ${time.start} \t end: ${time.end}`;
    newElement.innerText = time_text;
    document.getElementById("saved_times").appendChild(newElement);
    newElement.addEventListener('mouseenter', ()=>{
        const cancelElement = document.createElement('img');
        cancelElement.src = "./assets/cancel.png"; 
        cancelElement.classList.add("cancel");
        newElement.appendChild(cancelElement);
        cancelElement.addEventListener('click', (e)=>{
            const newElementArr = newElement.id.split('_');
            const day_w = newElementArr[2];
            const start = newElementArr[3];
            chrome.storage.local.get(day_w, (items)=>{
                for (let key in items[day_w]){
                    if(items[day_w][key].start == start) {
                        delete items[day_w][key];
                        chrome.storage.local.set({[day_w]: items[day_w]})
                        return;
                    }
                }
            })
            newElement.remove(); 
        })
    });
    newElement.addEventListener('mouseleave', ()=>{
        const cancel = document.querySelector(".cancel");
        cancel.remove(); 
    })
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

