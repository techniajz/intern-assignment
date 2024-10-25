
// Q2:-

str = "ssssrfgiiklooo"
map1 = new Map()
for(i=0;i<str.length;i++){
    
  
    if(map1.has(str[i]) == true){
        
        map1.set(str[i],map1.get(str[i])+1)
        
    }else{
        map1.set(str[i],1)
    }

    
    
}


console.log([...map1])  // convert in list
console.log(Object.fromEntries([...map1])) //convert in object
