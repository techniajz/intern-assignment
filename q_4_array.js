let array1=[1,2,3,4]
let array2= [3,4,5,6,]
let array3= [...array1, ...array2]
let s1= [... new Set(array3)]
console.log(s1);
