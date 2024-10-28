function clock(time){
    let [hours,minutes] = time.split(":").map(Number)
    let period = hours>=12 ? "PM" : "AM" ;

    hours = hours%12 || 12;
        
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`
}

console.log(clock("12:00"));
