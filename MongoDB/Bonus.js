// Bonus Task - Department with Highest Average Performance Rating

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://user:Abhishek@cluster9.ggkmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('companyDB');
        const employees = database.collection('employees');

        const highestAveragePerformanceDepartment = await employees.aggregate([
            {
                $group: {
                    _id: "$department",
                    averagePerformance: { $avg: "$performanceRating" },
                    employees: { $push: "$name" }
                }
            },
            {
                $sort: { averagePerformance: -1 }
            },
            {
                $limit: 1
            }
        ]).toArray();

        console.log("Department with Highest Average Performance Rating:", highestAveragePerformanceDepartment);
    } catch (error) {
        console.error("Error running the aggregation:", error);
    }
}

run().catch(console.error);
