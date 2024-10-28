//Task2 - Average salary of employee in each department
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://user:Abhishek@cluster9.ggkmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9"; 
const client = new MongoClient(uri);

//Exception Handling using try catch
async function run() {
    try {
        await client.connect();
        const database = client.db('companyDB');
        const employees = database.collection('employees');

        const averageSalaryByDepartment = await employees.aggregate([
            {
                // we have grouped by the id and the salary of the employee to find the 
                //average salary of employees in the database.
                $group: {
                    _id: "$department",
                    averageSalary: { $avg: "$salary" }
                }
            }
        ]).toArray();

        console.log("Average Salary by Department:", averageSalaryByDepartment);
    } catch (error) {
        console.error("Error running the aggregation:", error);
    }
}

run().catch(console.error);
