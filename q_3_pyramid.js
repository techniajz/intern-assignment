
let n=5;
let k=0;
let d=0;
for (let i=n;i>=1;i--){
      let str=''
      d++
      k=d
    
    for(let j =i*2;j>1;j--){
 
        while(k>=2){
            str = str+ " "
            k--;
        }
        str = str+ "*"
  
     n--;
    }
    console.log(str);      
}