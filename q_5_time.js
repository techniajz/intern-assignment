// let time  = new Date(0,0,0,14,30)
// time = time.toLocaleTimeString();
// console.log(time);
let time = '14:30';
let a= time.split(':');
if(a[0]<12){
   time = a[0] + ':' + a[1] +"AM"
}0
if(a[0]>12){
   time =  a[0]-12 + ':' +a[1] +" PM"
}
console.log(time);


