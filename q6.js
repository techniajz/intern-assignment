str = "my_name_is_xyz."
str = str.charAt(0).toUpperCase()+str.slice(1,str.length).replaceAll("_"," ")
console.log(str)

