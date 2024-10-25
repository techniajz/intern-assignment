
date = "14:25"

temp = parseInt(date.substr(0,2))

console.log(typeof temp)
val=0
if(temp>12){
    val = temp-12
    
    console.log(val+":"+date.substr(3,2)+" pm")
    
    
}
else{
	console.log(date+"Am")

}
