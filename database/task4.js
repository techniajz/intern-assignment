db.employees.aggregate([
    // sort the salary by the decreasing order
  { $sort: { salary: -1 } },
   // use the limit keyword for the top three role
  { $limit: 3 },
  //project only required field
  { $project: { _id: 0, name: 1, salary: 1 } },
]);
