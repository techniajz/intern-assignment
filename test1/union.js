let array1 = [1,2,3,4];
let array2 = [3,4,5,6];

let set = [...new Set([...array1,...array2])];

console.log(set);


