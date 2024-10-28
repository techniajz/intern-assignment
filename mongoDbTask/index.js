
const mongoose = require("mongoose");

// MongoDB connection URL
const link = "mongodb://localhost:27017/companyDB";

// Define a schema for the employees
const employeeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    salary: { 
        type: Number, 
        required: true 
    },
    joiningDate: { 
        type: Date, 
        required: true 
    },
    performanceRating: { 
        type: Number, 
        required: true 
    },
});

// Sample employee data
const employeesData = [
    {
        name: "Abhishek",
        department: "Engineering",
        salary: 7000,
        joiningDate: new Date("2022-06-15"),
        performanceRating: 4
    },
    {
        name: "Manav",
        department: "Marketing",
        salary: 6000,
        joiningDate: new Date("2021-09-10"),
        performanceRating: 3
    },
    {
        name: "Satvik",
        department: "Sales",
        salary: 6500,
        joiningDate: new Date("2023-04-01"),
        performanceRating: 5
    },
    {
        name: "Shubham",
        department: "Engineering",
        salary: 8000,
        joiningDate: new Date("2020-12-05"),
        performanceRating: 4
    },
    {
        name: "Chetan",
        department: "Sales",
        salary: 6800,
        joiningDate: new Date("2023-02-20"),
        performanceRating: 5
    },
    {
        name: "Rakesh",
        department: "HR",
        salary: 5000,
        joiningDate: new Date("2023-06-30"),
        performanceRating: 2
    },
    {
        name: "Sujeet",
        department: "Marketing",
        salary: 6200,
        joiningDate: new Date("2023-05-25"),
        performanceRating: 3
    },
    {
        name: "Nikhil",
        department: "HR",
        salary: 5600,
        joiningDate: new Date("2022-10-10"),
        performanceRating: 2
    },
    {
        name: "Dharmanshu",
        department: "Engineering",
        salary: 7200,
        joiningDate: new Date("2021-08-15"),
        performanceRating: 4
    },
    {
        name: "Satyam",
        department: "Engineering",
        salary: 9000,
        joiningDate: new Date("2023-01-12"),
        performanceRating: 5
    },
];

// Create a mongoose model for the employees
const Employee = mongoose.model("Employee", employeeSchema);

async function main() {
    try {
        // Connect to MongoDB
        await mongoose.connect(link);
        console.log("Connected to MongoDB!");

        // Insert sample data
        await Employee.insertMany(employeesData);
        console.log("Sample data inserted.");

        // Task 1: Find total number of employees in each department
        const totalEmpEachDep = await Employee.aggregate([
            {
                $group: {
                    _id: "$department",
                    totalEmployees: { $sum: 1 }
                }
            }
        ]);
        console.log("Total Employees per Department:", totalEmpEachDep);

        // Task 2: Calculate average salary of employees in each department
        const averageSalaryPerDept = await Employee.aggregate([
            {
                $group: {
                    _id: "$department",
                    averageSalary: { $avg: "$salary" }
                }
            }
        ]);
        console.log("Average Salary per Department:", averageSalaryPerDept);

        // Task 3: Retrieve names of employees who joined in the last 6 months
        const recentJoinees = await Employee.aggregate([
            {
                $match: {
                    joiningDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $project: {
                    name: 1,
                    _id: 0
                }
            }
        ]);
        console.log("Employees who joined in the last 6 months:", recentJoinees);

        // Task 4: Find top 3 highest-paid employees
        const top3HighestPaid = await Employee.aggregate([
            { $sort: { salary: -1 } },
            { $limit: 3 },
            { $project: { name: 1, salary: 1, _id: 0 } }
        ]);
        console.log("Top 3 highest-paid employees:", top3HighestPaid);

        // Task 5: Group employees by performance rating and calculate average salary
        const avgSalaryPerRating = await Employee.aggregate([
            {
                $group: {
                    _id: "$performanceRating",
                    averageSalary: { $avg: "$salary" }
                }
            }
        ]);
        console.log("Average Salary per Performance Rating:", avgSalaryPerRating);

        // Bonus Task: Find department with highest average performance rating
        const highestRatedDept = await Employee.aggregate([
            {
                $group: {
                    _id: "$department",
                    averageRating: { $avg: "$performanceRating" },
                    employees: { $push: "$name" }
                }
            },
            { $sort: { averageRating: -1 } },
            { $limit: 1 }
        ]);
        console.log("Department with highest average performance rating:", highestRatedDept);

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

// Execute the main function
main().catch(console.error);
