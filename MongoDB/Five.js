//Task5 - Group Employees by Performance Rating and Average Salary

const { MongoClient } = require('mongodb');

const url = "mongodb+srv://user:Abhishek@cluster9.ggkmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9"; 
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        const database = client.db('companyDB');
        const employees = database.collection('employees');

        const averageSalaryByPerformanceRating = await employees.aggregate([
            {
                $group: {
                    _id: "$performanceRating",
                    averageSalary: { $avg: "$salary" }
                }
            }
        ]).toArray();

        console.log("Average Salary by Performance Rating:", averageSalaryByPerformanceRating);
    } catch (error) {
        console.error("Error running in the aggregation:", error);
    }
}

run().catch(console.error);
