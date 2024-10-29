//task 1

db.employees.aggregate([
    {
        $group: {
            _id: "$department",
            total: { $sum: 1 }
        },
    }
])



//task 2

db.employees.aggregate([
    {
        $group: {
            _id: "$department",
            total: { $avg: "$salary" }
        },
    }
])


//task 3
 joiningDate : {$gte : ISODate ("2023-07-01T00:00:00Z")}


 //task 4 
 {$sort : {salary : -1}},{$limit:3}

 //task 5 
 
 $group:{
    _id : "$performanceRating",
    average : {$avg : "$salary"}
 }

 //bonus task 

 db.employees.aggregate([
    {
        $group: {
            _id: "$department",
            total:{ $avg: "$performanceRating"},
            employees : {$push :  "$name"},
        },
    },{$sort: { total: -1 }},{$limit: 1}
])

