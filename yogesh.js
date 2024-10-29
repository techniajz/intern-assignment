// SELECT E1.*
// FROM employees E1
// INNER JOIN (
//     SELECT department, AVG(performanceRating) as avg_rating
//     FROM employees
//     GROUP BY department  ORDER BY avg_rating DESC
// LIMIT 1
// ) E2 ON E1.department = E2.department
// ;

// /*  Task 1  */
// SELECT department, count(department) FROM `employees` GROUP by department;
// /* Task 2 */
// SELECT department, AVG(salary) from 	`employees` GROUP BY department;
// /*  Task 3 */
// SELECT name, salary from 	`employees` ORDER BY salary DESC LIMIT 3;
// /*  Task 5 */
// SELECT performanceRating, AVG(salary) from 	`employees` GROUP BY performanceRating;
// /*  Task 4 */
// SELECT *
//     FROM employees
//     WHERE joinedDate >= NOW() - INTERVAL 6 MONTH;

//     INSERT INTO `salaries`( `emp_id`, `month`, `year`, `salary`) VALUES (102,1,2024,50000),(102,2,2024,40000) ,(102,3,2024,40000),(102,4,2024,40000),(102,5,2024,40000),(102,6,2024,40000);


//  mongo


db.employees.insertMany([

    {
        "name": "John Doe",
        "emp_id":101,
        "department": "Engineering",
        "salary": 60000,
        "performanceRating": 4,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":102,
        "name": "Aman",
        "department": "Engineering",
        "salary": 70000,
        "performanceRating": 5,
        "joinedDate": new Date("2020-07-01")
    },
    {
        "emp_id":103,
        "name": "Joss buttler",
        "department": "Sales",
        "salary": 20000,
        "performanceRating": 3,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":104,
        "name": "Alex Hales",
        "department": "Marketing",
        "salary": 40000,
        "performanceRating": 4,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":105,
        "name": "Carry wokes",
        "department": "Marketing",
        "salary": 50000,
        "performanceRating": 5,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":106,
        "name": "JaiSuriya",
        "department": "Engineering",
        "salary": 50000,
        "performanceRating": 3,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":107,
        "name": "Sanjay",
        "department": "Sales",
        "salary": 40000,
        "performanceRating": 4,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":108,
        "name": "Shakun",
        "department": "Sales",
        "salary": 10000,
        "performanceRating": 2,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":109,
        "name": "Sholker",
        "department": "marketing",
        "salary": 20000,
        "performanceRating": 2,
        "joinedDate": new Date("2020-01-01")
    },
    {
        "emp_id":110,
        "name": "Cris ",
        "department": "Sales",
        "salary": 40000,
        "   ": 5,
        "joinedDate": new Date("2020-01-01")
    },
    



])
// q1  find the total no of employees in each department 

db.employees.aggregate([
    {
      $group: {
        _id: "$department",
        employeeCount: { $sum: 1 }
      }
    }
  ])

// q2 calculate the avg salary of each department
  db.employees.aggregate([{
    $group {
    _id : "$department",
    avgSalary : {avg : "$salary"}
    }
    }])

//  q3 who has joined in last 6 month
    db.employees.aggregate([
        {
          $match: {
            joinedDate: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
          }
        },
        {
          $project: {
            _id: 0,
            name: 1,
            joinedDate: 1
          }
        }
      ])
// q4   top 3 heighest paid 
      db.employees.find().sort({salary : -1 }).limit(3)
    // q5  avg salary based on performance

      db.employees.aggregate([
        {
            $group: {
                _id: '$rating',
                averageSalary: { $avg: '$salary' }
            }
        }
    ])

    /// bonus 

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