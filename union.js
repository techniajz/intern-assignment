let arr1 = [1,2,3,4]; 
let arr2 = [3,4,5,6]; 
let nwArr = [...arr1, ...arr2];
let st = new Set([...nwArr]);
st.forEach((val) => {
    console.log(val);
});
