//01//
let str = "ssaewrdcdferreddcsdcd"

let str2 = str.split("");

let output = {}

str2.forEach((x)=>{
    if(output[x]){
        output[x]+=1
    }else{
        output[x]=1
    }
})
console.log(output)

//02//
let output2 ={}

for(let val of str2){
    if(output2[val]){
        output2[val]+=1;
    }else{
        output2=1;
    }
}
console.log(output2);