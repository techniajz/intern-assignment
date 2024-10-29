let time = "14:30";

let time2 = time.split(":");

let hour = time2[0];
let minutes = time2[1]

let amOr = 12? 'am':'pm'

hour=(hour%12||12);

console.log("Time-"+hour+":"+minutes+" "+amOr);