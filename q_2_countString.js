let str='ssaewrcdferreddesded'
let newDup={}

for (let i=0; i<str.length; i++){
    if(newDup[str[i]]==undefined){
       newDup[str[i]]=1;
    }
    else{
       newDup[str[i]]++;
    }
  
    
}

console.log(newDup)