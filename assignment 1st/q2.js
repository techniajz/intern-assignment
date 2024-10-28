
//using for loop


let str = "ssaewrcferreddcscd";
const obj = {}; 
newStr = str.trim().split("");
for (x of newStr) {
    if (obj[x]){
        obj[x]+=1;
    }
    else{
        obj[x] = 1;
    }
}
console.log(obj);





//using using iteration method-for each
 
let str1 = "ssaewrcferreddcscd"
const obj1 = {};
newStr = str1.trim().split("");
// console.log(newStr);
newStr.forEach((value, index, array) => {
    if (obj1[value])
         {
        obj1[value] += 1;
          }
    else obj1[value] = 1
})
console.log(obj1);
