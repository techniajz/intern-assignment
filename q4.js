//using spread operator and set

const arr_1 = [1, 2, 3, 4];
const arr_2 = [3, 4, 5, 6];
const arr3 = [...arr_1, ...arr_2];
console.log([...new Set(arr3)]);





//using filter method
const arr1 = [1, 2, 3, 4];
const arr21 = [3, 4, 5, 6];
const uniqueArr = arr21.filter((value) => !arr1.includes(value));
const result = [...arr1, ...uniqueArr];
console.log(result);


//using for loop and conditional operator
const arr = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const uniArr = [];
for (let i = 0; i < arr.length + arr2.length; i++) {
    const val = i < arr.length ? arr[i] : arr2[i - arr.length];
    if (!uniArr.includes(val)) uniArr.push(val);
}

console.log(uniArr);

