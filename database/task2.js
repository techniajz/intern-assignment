db.employees.aggregate([
    //here we can take the same deparment in same collection and find there
    // average salary by the avg function
  { $group: { _id: "$department", averageSalary: { $avg: "$salary" } } },
]);
