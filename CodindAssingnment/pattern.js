let n = 5
for(let i=n; i>=1 ; i--){
    let space = " ";
    let str = "*";
    console.log( space.repeat(n-i) + str.repeat(2*i - 1));
};









// Extra patterns for practice


// let n = 10;
// for(let i=1;i<=1;i++){
//     let str = "* ";
//     let space = " ";
//     for(let j = 1; j<=n/2;j++){
//         console.log(space.repeat(n/2-j) + str.repeat(j));
//     }
//     for(let k=n/2-1;k>=1;k--){
//         console.log(space.repeat(n/2 - k)+ str.repeat(k));
//     }
// }

// let n = 3
// for(let i=1;i<=1;i++){
//     let str = "* ";
//     let space = " ";
//     for(let j = 1; j<=n;j++){
//         console.log(space.repeat(n-j) + str.repeat(j));
//     }
//     for(let k=n-1;k>=1;k--){
//         console.log(space.repeat(n-k)+ str.repeat(k));
//     }
// }


// let str = "*";
// let space = " ";
// let n = 5;
// let index = 0;
// for(let i=1;i<=n;i++){
//     console.log(space.repeat(n-i) + str.repeat(i+index));
//     index++;
// }
// index--;
// for(let j=n;j>=1;j--){
//     console.log(space.repeat(n-j)+str.repeat(j+index));
//     index--;
// }


// let str = "*";
// let space = " ";
// let n = 10;
// let index = 0;
// for(let i=1;i<=n;i++){
//     console.log(space.repeat(n-i) + str.repeat(i+index));
//     index++;
// }
// index--;
// for(let j=n;j>=1;j--){
//     console.log(space.repeat(n-j)+str.repeat(j+index));
//     index--;
// }

// let n = 3;
// let index = 0;
// let space = " ";
// for(let i=1;i<=n;i++){
//         let str = "";
//     for(let j=n; j>=i; j--){
//         str = str + space;
//     }
//     for(let j=1;j<=i + index;j++){
//         if(j == 1 || j == (i+index)){
//             str = str + "*";
//         }
//         else{
//             str = str + space;
//         }
//     }
//     index++;
//     console.log(str);
// }

// index--;
// for(let i=1;i<=n;i++){
//     let str2 = "";
//     for(let j=1;j<=i;j++){
//         str2 = str2 + " ";
//     }
//     for(let j = 1; j <= n+index; j++){
//         if(j == 1 || j == (n+index)){
//             str2 = str2 + "*";
//         }
//         else{
//             str2 = str2 + space;
//         }
//         // str2 = str2 + `${j}`;
//     }
//     index-=2;
//     console.log(str2);
// }

