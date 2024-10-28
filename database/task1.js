db.employees.aggregate([
    // here we can make the collection in the form of department and count 
  { $group: { _id: "$department", count: { $sum: 1 } } },
]);
