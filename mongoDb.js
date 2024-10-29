// For Task 1 

db.employees.aggregate([
    {$group : {_id:"$department",count:{$sum:1}}}
])

// For Task 2

db.employees.aggregate([
    {$group:{_id:"$department",avgSalary:{$avg:"$salary"}}}
])

// For Task 3

db.employees.aggregate([
    {
        $match: {
            joiningDate:{
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
        }
    },
    {
      $project: {
          _id:0,
          name:1,
          joiningDate:1
      }  
    }
    ])


// For Task 4

db.employees.find({}).sort({ salary:-1 }).limit(3)


// For Task 5 

db.employees.aggregate({
    $group: { _id: "$performanceRating",avgSalary:{$avg:"$salary"}}
})


// For Bonus Question 

db.employees.aggregate([
    {
      $group: {
        _id: "$department",
        averageRating: { $avg: "$performanceRating" },
      performanceRating :{$push : "$performanceRating"},
       salary :{$push : "$salary"},
   employee: { $push: "$name" },
      },
    },
    {
  $sort :{performanceRating :-1}
  },{
  $limit :1
  }
]);


// Data
[{
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3011"
    },
    "name": "Aditya",
    "department": "Engineering",
    "slary": 30000,
    "joiningDate": {
      "$date": "2024-10-15T00:00:00.000Z"
    },
    "performanceRating": 4
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3012"
    },
    "name": "Samarth",
    "department": "Sales",
    "salary": 60000,
    "joiningDate": {
      "$date": "2024-01-04T18:30:00.000Z"
    },
    "performanceRating": 5
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3013"
    },
    "name": "Punit",
    "department": "Marketing",
    "salary": 50000,
    "joiningDate": {
      "$date": "2024-06-07T18:30:00.000Z"
    },
    "performanceRating": 3
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3014"
    },
    "name": "Rohit",
    "department": "Engineering",
    "salary": 45000,
    "joiningDate": {
      "$date": "2024-02-06T18:30:00.000Z"
    },
    "performanceRating": 4
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3015"
    },
    "name": "Ayush",
    "department": "Sales",
    "salary": 30000,
    "joiningDate": {
      "$date": "2024-09-07T18:30:00.000Z"
    },
    "performanceRating": 3
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3016"
    },
    "name": "Sachin",
    "department": "Marketing",
    "salary": 25000,
    "joiningDate": {
      "$date": "2024-03-04T18:30:00.000Z"
    },
    "performanceRating": 2
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3017"
    },
    "name": "Ajay",
    "department": "Engineering",
    "salary": 30000,
    "joiningDate": {
      "$date": "2024-06-04T18:30:00.000Z"
    },
    "performanceRating": 2
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3018"
    },
    "name": "Akshay",
    "department": "Sales",
    "salary": 32000,
    "joiningDate": {
      "$date": "2024-04-16T18:30:00.000Z"
    },
    "performanceRating": 3
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a3019"
    },
    "name": "Abhay",
    "department": "Marketing",
    "salary": 25000,
    "joiningDate": {
      "$date": "2024-02-18T18:30:00.000Z"
    },
    "performanceRating": 5
  },
  {
    "_id": {
      "$oid": "6720c3bde8b3121cfa3a301a"
    },
    "name": "Anuj",
    "department": "Engineering",
    "salary": 30000,
    "joiningDate": {
      "$date": "2024-01-03T18:30:00.000Z"
    },
    "performanceRating": 4
  }]