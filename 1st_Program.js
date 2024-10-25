// Q1..


//Q1.

const users =[
    {id:1,name:"Alice"},
    {id:2,name:"Bob"},
    {id:3,name:"Charlie"}
]

const orders =[
    
    {UserId:1,amount:50},
    {UserId:1,amount:100},
    {UserId:2,amount:75},
    {UserId:3,amount:"invalid"}
]

let user = " "
let order = ""
let amount =0
try{


for(let i=0;i<users.length;i++){
    
    user = users[i].id
    amount =0
    for(let j=0;j<orders.length;j++){
        
        order = orders[j].UserId
        
        if(user==order){
            if(orders[j].amount !="invalid"){
            amount =   amount+orders[j].amount
            }else{
                amount =0
            }
            
            
        }
        
        
    }
    console.log(users[i].name+" Spent "+amount)    

    
}
}
catch(err){
    console.log(err)
}

