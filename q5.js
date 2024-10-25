a = prompt("enter time in format - HH:MM");
b = a.split(":")
function change(hour, mint) {
  hour = Number(hour);
  let a = "am"
  // let ha = hour
  if (hour > 12) {
    hour =hour - 12;
    a = "pm";
  }
  console.log(`time is - ${hour}:${mint} ${a}`);
}

change(b[0], b[1]);