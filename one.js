//Question1 - Analyzing user spending based on a list of users nad their corresponding orders
const users = [
    {
        id:1,
        name:'Alice'
    },
    {
        id:2,
        name:'Bob'
    },
    {
        id:3,
        name:'Charlie'
    }
]

const orders = [
    {
        userId:1,
        amount:50
    },
    {
        userId:1,
        amount:100,
    },
    {
        userId:2,
        amount:75,   
    },
    {
        userId:3,
        amount:'invalid'
    }
];

try{
    users.forEach(val => {
        let id = val.id;
        let value = 0;
        orders.map((ele)=>{
           let userId = ele.userId;
           if(id==userId && ele.amount!=String){
              value += ele.amount;
           }
        //    else{
        //     throw new Error("Enter valid amount");
        //    }
        })
        console.log(val.name + "=" + value);
    });
}
catch(error){
//    console.log(error);
}