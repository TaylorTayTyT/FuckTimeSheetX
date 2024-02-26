// adding a new bookmark row to the popup

//this executes once you click the popup
chrome.tabs.query({active:true, currentWindow: true}, (tabs) => {
    console.log('start up');

    function populate(){
        console.log('will_populate');
        chrome.tabs.sendMessage(tabs[0].id, "EXECUTE");
    }
    function get_schedule_info(){
        chrome.storage.local.get(["1"], (result)=>{
            console.log(result);
        })
    }
    document.getElementById('populate').onclick = populate;
    document.getElementById('see_schedule').onclick = get_schedule_info;
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