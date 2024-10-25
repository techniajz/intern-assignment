let array1 = [1, 2, 3, 4];
let array2 = [3, 4, 5, 6];

let a = array1.concat(array2).filter((value,index,arr)=>{
    return arr.indexOf(value)===index;
});