
const users =[
    {id: 1, name: 'Alice'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Charlie'}

];

const orders = [
    {userId: 1, amount: 50},
    {userId: 1, amount: 100},
    {userId: 2, amount: 75},
    {userId: 3, amount: 'invalid'}
]



// Flatterning Array
// let x = [1, [2, 3], [4, [5]]];
// let y = [1,2,9,4,3,7,8];

// let u = x.flat();
// console.log(u);


// Find Occurence of all elements////////
// let str = "ssaewrdcdferreddcsdcd"

// let str2 = str.split("")
// let output = {};

// str2.forEach(x =>{
//     if(output[x]){
//         output[x]+=1
//     }else{
//         output[x]=1
//     }
// })
// console.log(output);
// Find Occurence of all elements////////


// let str = "ssaewrdcdferreddcsdcd";

// let str2 = str.split("");
// let output = {}

// for(let val of str2){
//     if(output[val]){
//         output[val]+=1
//     }else{
//         output[val]=1
//     }
// }
// console.log(output);

//Getting Time //
// let a = prompt("Enter Time");
// arr  = a.split(":")

// let hours = parseInt(arr[0])
// let minutes = parseInt(arr[1])
// let p = hours>= 12? 'am':'pm';
// hours = (hours%12)||12

// let time = "Time- "+hours+":"+minutes+" "+p;
// console.log(hours+":"+minutes+""+p);
//Getting Time //




// let str = "ssaewrdcdferreddcsdcd"

// let str2 = str.split("");

// let output = {}

// str2.forEach((x)=>{
//     if(output[x]){
//         output[x]+=1
//     }else{
//         output[x]=1
//     }
// })
// console.log(output)

//Union of array//
// let array1 = [1, 2, 3, 4];
// let array2 = [3, 4, 5, 6];

// let a = array1.concat(array2).filter((value,index,arr)=>{
//     return arr.indexOf(value)===index;
// });

// console.log(a)
//Union of array//


//convert time//
// let time = "14:30";

// let time2 = time.split(":");

// let hour = time2[0];
// let minutes = time2[1]

// let amOr = 12? 'am':'pm'

// hour=(hour%12||12);

// console.log("Time-"+hour+":"+minutes+" "+amOr);
//convert time//

//Replace//
// let name = "my_name_is_xyz";

// let name2 = name.replaceAll("_"," ");

// console.log(name2);
//Replace//

//Reverse Pyrimid************
// let r = 5;
// for (let i = r; i >= 1; i--) {
//     for (let j = r - i; j > 0; j--) {
//         process.stdout.write("  ");
//     }
//     for (let k = 0; k < 2 * i - 1; k++) {
//         process.stdout.write("* ");
//     }
//     console.log();
// }


//git remote add origin https://github.com/techniajz/intern-assignment/akash-damor.git

//https://github.com/techniajz/intern-assignment
//https://github.com/akashdamor1/techniajz























 




















