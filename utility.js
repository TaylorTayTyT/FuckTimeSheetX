export default function valid_time(startTime, endTime){
    //09:44
    const startHour = startTime.substring(0, 2);
    const endHour = endTime.substring(0, 2);
    const startMin = startTime.substring(3, 5);
    const endMin = endTime.substring(3, 5);
    
    if(endTime == startTime) return false

    if(endHour - startHour < 0) return false

    if(endHour == startHour && endTime - endMin < 0) return false

    return [Math.floor(startMin / 15) * 15, Math.floor(endMin / 15) * 15]; 
}