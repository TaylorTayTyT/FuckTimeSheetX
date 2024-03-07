export default function valid_time(startTime, endTime){
    //09:44
    const startHour = startTime.substring(0, 2);
    const endHour = endTime.substring(0, 2);
    const startMin = startTime.substring(3, 5);
    const endMin = endTime.substring(3, 5);
    
    if(endTime == startTime) return false

    if(endHour - startHour < 0) return false

    if(endHour == startHour && endTime - endMin < 0) return false

    const start_round_down = startHour + ":" + String(Math.floor(startMin / 15) * 15);
    const end_round_down = endHour + ":" + String(Math.floor(endMin / 15) * 15);

    return [start_round_down, end_round_down]; 
}

export function this_week_dates(){

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
    console.log('sup')

    let date_arr = [];
    for (let i = 0; i < 7; i++){
        let curr_date_trans = new Date(curr_date);
        curr_date_trans.setDate(curr_date_trans.getDate() + i);

        curr_date_trans = curr_date_trans.toString().split(" ");
        console.log(i)
        console.log(curr_date_trans)
        let month = months[curr_date_trans[1]];
        let day = curr_date_trans[2];
        let year = curr_date_trans[3];
        date_arr.push(`${month}/${day}/${year} 12:00:00 AM`);
    }

    return date_arr; 
}