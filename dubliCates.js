// coutn duplicate char in str

const str ="ssaewrcdferreddcsdcs"

const sorted = str.split('').sort();

for(let i =0; i<sorted.length; i++){
    let cnt =0; 
    while(i<sorted.length-1 && sorted[i] == sorted[i+1]){
        cnt++; 
        i++; 
    }
    if(cnt > 1){
        console.log(sorted[i]+ "->" + cnt)
    }
}
