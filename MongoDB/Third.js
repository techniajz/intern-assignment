//Task3 - Names of Employees Who Joined in the Last 6 Months
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://user:Abhishek@cluster9.ggkmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9"; 
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('companyDB');
        const employees = database.collection('employees');

        const recentEmployees = await employees.aggregate([
            {
                $match: {
                    joiningDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $project: {
                    name: 1
                }
            }
        ]).toArray();

        console.log("Employees Who Joined in the Last 6 Months:", recentEmployees);
    } catch (error) {
        console.error("Error running in the aggregation:", error);
    }
}

run().catch(console.error);
