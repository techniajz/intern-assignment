//Question6 - Convert the string "my_name_is_xyz" to "My name is xyz";

let str = "my_name_is_xyz"

let str2 = str.split("_").join(" ");

let result = str2.charAt(0).toUpperCase() + str2.slice(1);

console.log(result);

