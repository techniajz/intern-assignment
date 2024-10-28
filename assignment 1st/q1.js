


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
const totalAmounts = {};
const nameObj = {};
try {
  for (const orderkey of orders) {

      if (totalAmounts[orderkey.userId]) {
        totalAmounts[orderkey.userId] += orderkey.amount;
      } else {
        totalAmounts[orderkey.userId] = orderkey.amount;
      }
  }
  //console.log(totalAmounts);
  for (const key of users) {
    if (users) { nameObj[key.name] = 0; }
  }
  // console.log(nameObj);
  for (const userkey of users) {
    for (const amountkey in totalAmounts) {

      if (amountkey == userkey.id ) {
        nameObj[userkey.name] = totalAmounts[amountkey];
        console.log(` total ammount spent by ${userkey.name} = ${totalAmounts[amountkey]}`)
      }                                 
    }
  }
}
catch (error) {                                     
  console.log(error);
}
// nameObj object also contain key as name and value as amount 
//console.log(nameObj);