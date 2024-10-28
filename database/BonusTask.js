db.employees.aggregate([
  {
    //first according to question i sort by the group
    $group: {
      _id: "$department",
      averagePerformanceRating: { $avg: "$performanceRating" },
    },
  },
  // sort in decreasing order by the average performance
  { $sort: { averagePerformanceRating: -1 } },
  //pick the top element
  { $limit: 1 },

  // it project the data on so that we can see the data
  {
    $project: {
      _id: 0,
      department: "$_id",
      averagePerformanceRating: 1,
      employees: "$employees.name",
    },
  },
]);
