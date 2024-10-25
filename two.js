//question2 - Count the duplicate character in a string
let str = "ssaewrcdferreddcsdcd";

let result = {};
let duplicate={}

for(const x of str){
    result[x] = (result[x] || 0) + 1;
}

for(const x in result){
    if(result[x]>1){
       duplicate[x] = result[x];
    }
}

console.log(duplicate);

