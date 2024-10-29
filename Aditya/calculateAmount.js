const users = [
    {
        id:1,
        name:"Alice"
    },
    {
        id:2,
        name:"Bob"
    },
    {
        id:3,
        name:"Charlie"
    }
];

const orders = [
    {
        userId:1,
        amount:50
    },
    {
        userId:1,
        amount:100
    },
    {
        userId:2,
        amount:75
    },
    {
        userId:3,
        amount:'invalid'
    }
];

function calculateAmount() {
    let arr = [];
    for(let i = 0 ; i < users.length; i++){
        let userid = users[i].id;
        let name = users[i].name;
        let temp = {};
        let sumAmount = 0;
        for(let j=0; j<orders.length; j++){
            let ordersId = orders[j].userId;
            let amount = orders[j].amount;
            if(userid == ordersId){
                if(amount !== 'invalid'){
                    sumAmount += amount;
                }
                else{
                    sumAmount = 0;
                }
            }
        }
        temp.id = userid;
        temp.name = name;
        temp.totalAmount = sumAmount;
        arr.push(temp);
    }
    console.log(arr);
    
}

try {
    calculateAmount();
} catch (error) {
    console.log("Error");
}

