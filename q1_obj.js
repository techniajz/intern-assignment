const users=[
    {
        id: 1,
        name: 'Alice',
       
    },
    {
        id: 2,
        name: 'Bob',
       
    },
    {
        id: 3,
        name: 'Charlie',
       
    }
]
const orders=[
    {
       
        userId: 1,
        amount: 50
    },
    {
      
        userId: 1,
        amount: 100
    },
    {
    
        userId: 2,
        amount: 75
    },
    {
       
        userId: 3,
        amount: "Invalid"
    }

 ]

 function totalCalculate(users , orders) {
    let total=0 

for (let x of users){
    for(let y of orders){
        if(x.id===y.userId){
         if (Number.isInteger(y.amount )){
            total+=y.amount
         }
       else{
         // console.log(`Invalid amount for order of userId ${y.userId}: ${y.amount}`);
         throw new Error(`Invalid amount for order of userId ${y.userId}: ${y.amount}  `);
         
       }
        
         
          
        }
       

    }
  
    x.totalAmount=total
    total=0
  
}
return users
    
 }
 try{
    console.log(totalCalculate(users,orders));
 }
 catch(e){
    console.log(e.message);
 }