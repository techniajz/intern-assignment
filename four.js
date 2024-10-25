//Question4 - Find the union of two array in javascript

let array1 = [1,2,3,4];
let array2 = [3,4,5,6];

function findUnion(arr1,arr2){
    return [...new Set([...arr1,...arr2])];
}

console.log(findUnion(array1,array2));