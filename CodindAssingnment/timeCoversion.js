let time = "12:30";
let timeArr = time.split(":");
let hour = parseInt(timeArr[0]);
let minutes = parseInt(timeArr[1]);
let newTime = "";
if(hour > 12 && hour < 24){
    let pmTime = hour-12;
    newTime = newTime + pmTime.toString() + ":" + timeArr[1] + " PM";
}else if (hour == 12){
    newTime = newTime + hour.toString() + ":" + timeArr[1] + " PM";
}else if(hour == 24){
    newTime = newTime + "00" + ":" + timeArr[1] + " AM";
}
else{
    newTime = newTime + hour.toString() + ":" + timeArr[1] + " AM";
}

console.log(newTime);
