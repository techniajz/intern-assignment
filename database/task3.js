db.employees.aggregate([
  {
    // using the match keyword we match the joining date in the last 6 months  
    $match: {
      joiningDate: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      },
    },
  },
]);
