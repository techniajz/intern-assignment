db.employees.aggregate([
  {
    $group: {
        // group by the performance Rating
      _id: "$performanceRating",
      // here I find the average salary
      averageSalary: { $avg: "$salary" },
      // count the employees
      employeeCount: { $sum: 1 },
    },
  },
]);
