let str="",str1=""

let n=5
for(let i=1;i<=n;i++)
{
    str=""
    str1=""
   if(i>1){
    
    for(j=1;j<i;j++)
    {
        str =str+" " 
    }
       
   }
    for(k=n*2-1;k>=i*2-1;k--){
         str1 =str1+"*"
    }
    s = str+str1
    console.log(s)
    
    }


