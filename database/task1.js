db.employees.aggregate([
    // here we can make the collection in the form of department and count 
    //that department field
  { $group: { _id: "$department", count: { $sum: 1 } } },
]);
