// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('companyDB');

// Create a new document in the collection.
db.getCollection('employees').insertMany({
    { name: "Abhishek Choudhary", department: "Marketing", salary: 5000, joiningDate: new Date("2023-04-15"), performanceRating: 4 },
    { name: "Satvik Priyadarshi", department: "Engineering", salary: 8000, joiningDate: new Date("2022-09-01"), performanceRating: 5 },
    { name: "Chetan Sharma", department: "Sales", salary: 6000, joiningDate: new Date("2023-02-10"), performanceRating: 3 },
    { name: "Rahul Pandey", department: "Marketing", salary: 5500, joiningDate: new Date("2023-05-20"), performanceRating: 4 },
    { name: "Abhinav Singh", department: "Engineering", salary: 7500, joiningDate: new Date("2021-11-15"), performanceRating: 4 },
    { name: "Anuj sharma", department: "Sales", salary: 6200, joiningDate: new Date("2023-06-25"), performanceRating: 5 },
    { name: "Yogesh Kumar", department: "Engineering", salary: 9000, joiningDate: new Date("2021-01-30"), performanceRating: 5 },
    { name: "Sumit Pathak", department: "Marketing", salary: 4800, joiningDate: new Date("2022-03-15"), performanceRating: 2 },
    { name: "Aditya Soni", department: "Sales", salary: 5300, joiningDate: new Date("2023-07-10"), performanceRating: 3 },
    { name: "Aditi Sharma", department: "Marketing", salary: 6000, joiningDate: new Date("2022-08-05"), performanceRating: 5 }
});
