db.employees.aggregate([
  {
    //according to question sort by the group
    $group: {
      _id: "$department",
      averagePerformanceRating: { $avg: "$performanceRating" },
    },
  },
  // sort in decreasing order by the average performance
  { $sort: { averagePerformanceRating: -1 } },
  //pick the top element
  { $limit: 1 },

  // project is use to return the specify fields
  {
    $project: {
      _id: 0,
      department: "$_id",
      averagePerformanceRating: 1,
      employees: "$employees.name",
    },
  },
]);
