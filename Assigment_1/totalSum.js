
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
];


const orders = [
    { userId: 1, amount: 50 },
    { userId: 1, amount: 100 },
    { userId: 2, amount: 75 },
    { userId: 3, amount: 'invalid' }
];


const total = {};


const obj = {};

try {
 
    for (const order of orders) {
       
        if (typeof order.amount === 'number') {
           
            if (total[order.userId]) {
                total[order.userId] += order.amount;
            } else {
                total[order.userId] = order.amount;
            }
        }
    }
    console.log("Total git", total);

  
    for (const user of users) {
        obj[user.name] = 0;
    }
    console.log("Initialized user totals:", obj);

    
    for (const user of users) {
        if (total[user.id]) {
            obj[user.name] = total[user.id];
        }
    }
} catch (error) {
    console.log("Error:", error.message);
}


console.log(obj);