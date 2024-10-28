const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  
  const orders = [
    { userId: 1, amount: 50 },
    { userId: 2, amount: 75 },
    { userId: 1, amount: 100 },
    { userId: 3, amount: 'invalid' }  
  ];


 
    function calculate(users, orders){
        let spending = {};

        for (let user of users) {
            spending[user.name] = 0;  
          }
  
        for(let order of orders){
            try {
                if(typeof order.amount !== 'number'){
                throw new Error("the invalid number");
                }

                let user = users.find(user => user.id ===order.userId)
                if(user){
                    spending[user.name] += order.amount;
                }
                
            } catch (error) {
                console.log( error.message);
            }
        }
        return spending
    }

 console.log(calculate(users,orders));
 