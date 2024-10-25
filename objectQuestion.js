
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    {id:1,name:'satvik'},
    { id: 3, name: 'Charlie' }
  ];
  
  const orders = [
    { userId: 1, amount: 50 },
    { userId: 1, amount: 100 },
    { userId: 2, amount: 75 },
    { userId: 2, amount: 345 },
    { userId: 3, amount: 'invalid' }
  ];
  
//   users.forEach((user) => {
//     let totalAmount = 0;
//     orders.map((order) => {
//       if (order.userId === user.id) {
//         const amount =order.amount;
//           totalAmount += amount;
//       }
//     });
//       console.log(`${user.name} = ${totalAmount}`);
//   });
  
  
  
  users.forEach((user) => {
    const userOrders = orders.filter(order => order.userId === user.id);
    let totalAmount = 0;
    let isInvalid = false;
    userOrders.forEach((order) => {
      const amount =order.amount  
      if (!isNaN(amount)) {
        totalAmount += amount;
      } else {
        isInvalid = true;
      }
    });
  
    if (isInvalid) {
      console.log(`${user.name} total expense = invalid`);
    } else {
      console.log(`${user.name} total expense = ${totalAmount}`);
    }
  });
  