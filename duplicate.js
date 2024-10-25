str = "ssaewrcdferreddcsdcd";

const list = new Map();
const set = new Set();


for(let char of str){
    if(list.has(char)){
        list.set(char,list.get(char)+1);
    }else{
        list.set(char,1);
    }
    set.add(char)
}

for(let char of set){
    if(list.get(char)>1){
        console.log(list.get(char));
    }
}
