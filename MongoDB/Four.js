//Task4 - Top 3 Highest-Paid Employees

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://user:Abhishek@cluster9.ggkmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9"; 
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('companyDB');
        const employees = database.collection('employees');

        const topPaidEmployees = await employees.aggregate([
            {
                $sort: { salary: -1 }
            },
            {
                $limit: 3
            }
        ]).toArray();

        console.log("Top 3 Highest Paid Employees:", topPaidEmployees);
    } catch (error) {
        console.error("Error running in the aggregation:", error);
    }
}

run().catch(console.error);
